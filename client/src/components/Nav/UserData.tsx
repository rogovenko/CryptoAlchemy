import React, { memo } from 'react';

interface UserDataProps {
  health: number;
  moves: number;
}

const UserData: React.FC<UserDataProps> = memo(({ health, moves }) => {
  return (
    <>
      <span className="p-2 rounded bg-white">HP: {health !== -1 ? health : "?"}</span>
      <span className="p-2 rounded bg-white">Clicks: {moves !== -1 ? moves : "?"}</span>
    </>
  );
});

export default UserData;