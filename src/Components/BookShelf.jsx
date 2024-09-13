import React from "react";
import image1 from "/book1.png";
import image2 from "/book2.png";
import image3 from "/book3.png";
import image4 from "/book4.png";
import image5 from "/book5.png";
import shelf from "/woodenshelf.png";
import { useNavigate } from "react-router-dom";

// Array of book titles or objects with more details
const books = [
  { title: "Daisy Jones & the Six" },
  { title: "Black Sheep" },
  { title: "The Sugar Palace" },
  { title: "The Secret" },
  { title: "Tomorrow and Tomorrow" },
  { title: "Happy Place" },
  { title: "Someone Else's Shoes" },
  { title: "I Will Find You" },
  { title: "Lessons in Chemistry" },
  { title: "The Great Gatsby" },
  { title: "To Kill a Mockingbird" },
  { title: "1984" },
  { title: "Pride and Prejudice" },
  { title: "The Catcher in the Rye" },
  { title: "The Hobbit" },
  { title: "The Lord of the Rings" },
  { title: "Harry Potter and the Sorcerer's Stone" },
  { title: "The Chronicles of Narnia" },
  { title: "The Hunger Games" },
  { title: "The Da Vinci Code" },
  { title: "The Alchemist" },
  { title: "The Fault in Our Stars" },
  { title: "The Kite Runner" },
  { title: "The Book Thief" },
  { title: "Gone Girl" },
  { title: "The Girl on the Train" },
  { title: "The Help" },
  { title: "The Maze Runner" },
  { title: "The Lovely Bones" },
];

// Array of image URLs
const images = [image1, image2, image3, image4, image5];

// Utility function to get a random image from the array
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

const BookShelf = ({ setIsBookHovered, isPodcastHovered, isBookHovered }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className='bookshelf-container'
        onMouseEnter={() => {
          setIsBookHovered(true);
        }}
        onMouseLeave={() => {
          setIsBookHovered(false);
        }}
        style={{ opacity: isPodcastHovered ? 0.2 : 1 }}
      >
        {isBookHovered && (
          <button className='book-button' onClick={() => navigate("/books")}>
            Read
          </button>
        )}
        <div className='bookshelf'>
          {books.map((book, index) => (
            <div className='book' key={index}>
              <img
                src={getRandomImage()}
                alt={book.title}
                className='book-image'
              />
              <div className='book-title'>{book.title}</div>
            </div>
          ))}
        </div>
        <img src={shelf} alt='shelf' className='shelf-image' />
      </div>
    </>
  );
};

export default React.memo(BookShelf);
