import React, { useState } from "react";
import image1 from "/book1.png";
import image2 from "/book2.png";
import image3 from "/book3.png";
import image4 from "/book4.png";
import image5 from "/book5.png";
import shelf from "/woodenshelf.png";
import Modal from "./Modal.jsx";
import { useWindowSize } from "@uidotdev/usehooks";

// Array of image URLs
const images = [image1, image2, image3, image4, image5];

// Utility function to get a random image from the array
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

const IndividualBookShelf = ({ books }) => {
  const [selectedBook, setSelectedBook] = useState(null);

  const handleBookClick = (book) => {
    setSelectedBook(book); // Set the selected book when a book is clicked
  };

  const closeModal = () => {
    setSelectedBook(null); // Reset the selected book to close the modal
  };

  const { width } = useWindowSize();

  return (
    <>
      {width < 768 ? (
        <div className='bookshelf-container2'>
          {books.map((book, index) => (
            <React.Fragment key={index}>
              <div className='book2'>
                <img
                  src={getRandomImage()}
                  alt={book.name}
                  className='book-image'
                  onClick={() => handleBookClick(book)}
                />
                <div className='book-title2'>{book.name}</div>
              </div>

              {/* Insert the shelf image after every 30 books */}
              {(index + 1) % 13 === 0 && (
                <img src={shelf} alt='shelf' className='shelf-image2' />
              )}
            </React.Fragment>
          ))}

          {/* Add a shelf image at the bottom if books don't perfectly fill the last row */}
          {books.length % 50 !== 0 && (
            <img src={shelf} alt='shelf' className='shelf-image2' />
          )}
        </div>
      ) : (
        <div className='bookshelf-container2'>
          {books.map((book, index) => (
            <React.Fragment key={index}>
              <div className='book2'>
                <img
                  src={getRandomImage()}
                  alt={book.name}
                  className='book-image'
                  onClick={() => handleBookClick(book)}
                />
                <div className='book-title2'>{book.name}</div>
              </div>

              {/* Insert the shelf image after every 30 books */}
              {(index + 1) % 50 === 0 && (
                <img src={shelf} alt='shelf' className='shelf-image2' />
              )}
            </React.Fragment>
          ))}

          {/* Add a shelf image at the bottom if books don't perfectly fill the last row */}
          {books.length % 50 !== 0 && (
            <img src={shelf} alt='shelf' className='shelf-image2' />
          )}
        </div>
      )}

      {selectedBook && (
        <Modal
          title={selectedBook.name}
          closeModal={closeModal}
          author={selectedBook.author}
          oneLiner={selectedBook.oneLiner}
        />
      )}
    </>
  );
};

export default React.memo(IndividualBookShelf);
