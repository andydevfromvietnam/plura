import React from "react";

interface AgencyDetailPageProps {
  params: {
    agencyId: string;
  };
}

const AgencyDetailPage: React.FC<AgencyDetailPageProps> = ({ params }) => {
  return <div>{params.agencyId}</div>;
};

export default AgencyDetailPage;
