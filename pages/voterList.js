import React, { useContext } from "react";
import { VotingContext } from "../store/Voter";

const voterList = () => {
  const { getVoterList } = useContext(VotingContext);
  return (
    <div>
      voterList
      <button
        onClick={(e) => {
          e.preventDefault();
          getVoterList();
        }}
      >
        CALL
      </button>
    </div>
  );
};

export default voterList;
