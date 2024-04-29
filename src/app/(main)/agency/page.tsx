import AgencyDetails from "@/components/forms/agency-details";
import { PLURA_ROLE } from "@/lib/enums";
import { getAuthUserDetails, verifyAndAcceptInvition } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

interface AgencyDashboardProps {
  searchParams: {
    plan: Plan;
    state: string;
    code: string;
  };
}

const AgencyDashboard: React.FC<AgencyDashboardProps> = async ({
  searchParams,
}) => {
  const authUser = await currentUser();
  if (!authUser) return redirect("/sign-in");

  const agencyId = await verifyAndAcceptInvition();
  console.log({ agencyId });

  const user = await getAuthUserDetails();

  if (agencyId) {
    if (
      user?.role === PLURA_ROLE.SUBACCOUNT_GUEST ||
      user?.role === PLURA_ROLE.SUBACCOUNT_USER
    ) {
      return redirect("/subaccount");
    } else if (
      user?.role === PLURA_ROLE.AGENCY_ADMIN ||
      user?.role === PLURA_ROLE.AGENCY_OWNER
    ) {
      if (searchParams.plan) {
        return redirect(
          `/agency/${agencyId}/billing?plan=${searchParams.plan}`
        );
      }
      if (searchParams.state) {
        const statePath = searchParams.state.split("__")[0];
        const stateAgencyId = searchParams.state.split("__")[1];
        if (!stateAgencyId) return <div>Not authorized</div>;

        return redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
        );
      } else {
        return redirect(`/agency/${agencyId}`);
      }
    } else {
      return null;
    }
  }
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="p-4 rounded-xl max-w-[850px] border-[1px]">
        <h1 className="text-4xl">Create An Agency</h1>
        <AgencyDetails
          data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }}
        />
      </div>
    </div>
  );
};

export default AgencyDashboard;
