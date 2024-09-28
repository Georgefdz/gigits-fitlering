import { useState } from "react";
import woodenshelf from "/woodenshelfV2.png";
import Arrow from "/arrow.svg";
import Modal from "./Modal";
import { useWindowSize } from "@uidotdev/usehooks";
import styles from "./buk.module.css";
import book1 from "/book1.png";
import book2 from "/book2.png";
import book3 from "/book3.png";
import book4 from "/book4.png";
import book5 from "/book5.png";

function Buk({ uniqueSkills, records }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const { width } = useWindowSize();

  const bookImages = [book1, book2, book3, book4, book5];

  const getRandomBookImage = () => {
    const randomIndex = Math.floor(Math.random() * bookImages.length);
    return bookImages[randomIndex];
  };

  const filterBooksBySkill = (skill) => {
    const filteredBooks = records.filter((record) =>
      record.skill.some(
        (s) => s.trim().toLowerCase() === skill.trim().toLowerCase()
      )
    );
    // console.log(`Books for ${skill}:`, filteredBooks); // Debug log
    return filteredBooks;
  };

  const handleBookClick = (book) => {
    setSelectedBook({ ...book }); // Set the selected podcast when a podcast is clicked
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  return (
    <>
      {uniqueSkills.map((skill) => {
        const booksForSkill = filterBooksBySkill(skill);
        if (booksForSkill.length === 0) {
          return null;
        }
        return (
          <div key={skill}>
            {/* Render books above the shelf */}
            <div className={styles.booksContainer}>
              {booksForSkill.map((book) => (
                <div className={styles.bookItem} key={book.id}>
                  <img
                    src={getRandomBookImage()}
                    alt={book.name}
                    className={styles.bookImage}
                    onClick={() => handleBookClick(book)}
                  />
                  <span className={styles.bookName}></span>
                </div>
              ))}
            </div>

            {/* Render the wooden shelf */}
            <div className={styles.woodContainer}>
              <img src={woodenshelf} alt='Wooden Shelf' />
              <span>{skill}</span>
            </div>
          </div>
        );
      })}

      {selectedBook && (
        <Modal
          author={selectedBook.author}
          oneLiner={selectedBook.oneLiner}
          cover={selectedBook.recoImg}
          link={selectedBook.link}
          onClose={closeModal}
        />
      )}
    </>
  );
}

export default Buk;
