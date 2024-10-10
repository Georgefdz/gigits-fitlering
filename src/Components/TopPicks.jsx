import React from "react";

function TopPicks({ topList, type }) {
  if (type === "book") {
    return (
      <ol className='top-picks-list'>
        {topList.map((book, index) => (
          <a href={book.link} target='_blank' rel='noopener noreferrer'>
            <li key={index} className='top-picks-item'>
              {book.name}
            </li>
          </a>
        ))}
      </ol>
    );
  }

  if (type === "podcast") {
    return (
      <ol className='top-picks-list'>
        {topList.map((podcast, index) => (
          <a
            href={podcast.spotifyUrl}
            target='_blank'
            rel='noopener noreferrer'
          >
            <li key={index} className='top-picks-item'>
              {podcast.name}
            </li>
          </a>
        ))}
      </ol>
    );
  }
}

export default TopPicks;
