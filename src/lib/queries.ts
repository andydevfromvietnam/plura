"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { database } from "./database";
import { redirect } from "next/navigation";
import { Agency, Plan, User } from "@prisma/client";

export const getAuthUserDetails = async () => {
  const user = await currentUser();
  if (!user) {
    return;
  }

  const userData = await database.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      agency: {
        include: {
          sidebarOptions: true,
          subAccount: {
            include: {
              sidebarOptions: true,
            },
          },
        },
      },
      permissions: true,
    },
  });
  return userData;
};

export const createTeamUser = async (agencyId: string, user: User) => {
  if (user.role === "AGENCY_OWNER") return null;
  return await database.user.create({ data: { ...user } });
};

type ActivityLog = {
  agencyId: string;
  description: string;
  subaccountId?: string;
};

export const saveActivityLogsNotification = async (data: ActivityLog) => {
  const authUser = await currentUser();
  let userData;
  if (!authUser) {
    const response = await database.user.findFirst({
      where: {
        agency: {
          subAccount: {
            some: {
              id: data.subaccountId,
            },
          },
        },
      },
    });

    if (response) {
      userData = response;
    }
  } else {
    userData = await database.user.findUnique({
      where: {
        email: authUser.emailAddresses[0].emailAddress,
      },
    });
  }
  if (!userData) {
    console.log("Could not find user");
    return;
  }

  let foundAgencyId = data.agencyId;
  if (!foundAgencyId) {
    if (!data.subaccountId) {
      throw new Error(
        "You need to provide at least an agencyId or a subaccountId"
      );
    }
    const response = await database.subAccount.findUnique({
      where: {
        id: data.subaccountId,
      },
    });

    if (response) foundAgencyId = response.agencyId;
  }

  if (data.subaccountId) {
    await database.notification.create({
      data: {
        notification: `${userData.name} | ${data.description}`,
        user: {
          connect: {
            id: userData.id,
          },
        },
        agency: {
          connect: {
            id: foundAgencyId,
          },
        },
        subAccount: {
          connect: {
            id: data.subaccountId,
          },
        },
      },
    });
  } else {
    await database.notification.create({
      data: {
        notification: `${userData.name} | ${data.description}`,
        user: {
          connect: {
            id: userData.id,
          },
        },
        agency: {
          connect: {
            id: foundAgencyId,
          },
        },
      },
    });
  }
};

export const verifyAndAcceptInvition = async () => {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");
  const invitationExists = await database.invitation.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
      status: "PENDING",
    },
  });

  if (invitationExists) {
    const userDetails = await createTeamUser(invitationExists.agencyId, {
      email: invitationExists.email,
      agencyId: invitationExists.agencyId,
      avatarUrl: user.imageUrl,
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: invitationExists.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await saveActivityLogsNotification({
      agencyId: invitationExists.agencyId,
      description: "User accepted invitation",
      subaccountId: "",
    });

    if (userDetails) {
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || "SUBACCOUNT_USER",
        },
      });

      await database.invitation.delete({
        where: {
          email: userDetails.email,
        },
      });
      return userDetails.agencyId;
    } else {
      return null;
    }
  } else {
    const agency = await database.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });
    return agency ? agency.agencyId : null;
  }
};

export const updateAgencyDetails = async (
  agencyId: string,
  agencyDetail: Partial<Agency>
) => {
  const response = await database.agency.update({
    where: {
      id: agencyId,
    },
    data: {
      ...agencyDetail,
    },
  });
  return response;
};

export const deleteAgency = async (agencyId: string) => {
  const response = await database.agency.delete({
    where: {
      id: agencyId,
    },
  });
  return response;
};

export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser();

  console.log({ newUser, user });
  if (!user) return;
  const updatedUser = await database.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: newUser,
    create: {
      id: user.id,
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      role: newUser.role || "SUBACCOUNT_USER",
    },
  });

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: newUser.role || "SUBACCOUNT_USER",
    },
  });

  return updatedUser;
};

export const upsertAgency = async (agency: Agency, price?: Plan) => {
  if (!agency.companyEmail) return null;
  try {
    const agencyDetails = await database.agency.upsert({
      where: {
        id: agency.id,
      },
      update: agency,
      create: {
        users: {
          connect: { email: agency.companyEmail },
        },
        ...agency,
        sidebarOptions: {
          create: [
            {
              name: "Dashboard",
              icon: "category",
              link: `/agency/${agency.id}`,
            },
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/agency/${agency.id}/launchpad`,
            },
            {
              name: "Billing",
              icon: "payment",
              link: `/agency/${agency.id}/billing`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/agency/${agency.id}/settings`,
            },
            {
              name: "Sub Accounts",
              icon: "person",
              link: `/agency/${agency.id}/sub-accounts`,
            },
            {
              name: "Team",
              icon: "shield",
              link: `/agency/${agency.id}/team`,
            },
          ],
        },
      },
    });
    return agencyDetails;
  } catch (error) {
    console.log(error);
  }
};
