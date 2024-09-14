import React from "react";

function TopPicks({ topList }) {
  return (
    <ol className='top-picks-list'>
      {topList.map((podcast, index) => (
        <li key={index} className='top-picks-item'>
          {podcast.name}
        </li>
      ))}
    </ol>
  );
}

export default TopPicks;
