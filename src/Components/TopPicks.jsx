import React from "react";

function TopPicks({ topList }) {
  console.log(topList);
  return (
    <ol className='top-picks-list'>
      {topList.map((podcast, index) => (
        <a href={podcast.spotifyUrl} target='_blank' rel='noopener noreferrer'>
          <li key={index} className='top-picks-item'>
            {podcast.name}
          </li>
        </a>
      ))}
    </ol>
  );
}

export default TopPicks;
