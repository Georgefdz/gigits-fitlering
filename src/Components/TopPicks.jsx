import React from "react";

function TopPicks() {
  const topList = [
    { title: "1984" },
    { title: "The Hobbit" },
    { title: "The Lord of the Rings" },
    { title: "Harry Potter and the Sorcerer's Stone" },
    { title: "The Chronicles of Narnia" },
    { title: "The Hunger Games" },
    { title: "The Da Vinci Code" },
    { title: "The Alchemist" },
    { title: "The Fault in Our Stars" },
    { title: "The Book Thief" },
  ];

  return (
    <ol className='top-picks-list'>
      {topList.map((book, index) => (
        <li key={index} className='top-picks-item'>
          {book.title}
        </li>
      ))}
    </ol>
  );
}

export default TopPicks;
