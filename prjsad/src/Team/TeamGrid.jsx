import React from 'react';
import TeamCard from './TeamCard';

export default function TeamGrid({ teams }) {
  if (!teams || teams.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 col-span-full py-10">Không tìm thấy team/tác giả nào.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}