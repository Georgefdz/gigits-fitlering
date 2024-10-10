// Buk.jsx
import { useState } from "react";
import woodenshelf from "/woodenshelfV2.png";
import Arrow from "/arrowRight.png";
import { useWindowSize } from "@uidotdev/usehooks";
import styles from "./buk.module.css";
import book1 from "/book1.png";
import book2 from "/book2.png";
import book3 from "/book3.png";
import book4 from "/book4.png";
import book5 from "/book5.png";

function Buk({ selectedSkills, records, setSelectedBook }) {
  const [currentIndices, setCurrentIndices] = useState({});
  const { width } = useWindowSize();

  let numberDisplayed;

  if (width > 768) {
    numberDisplayed = 10;
  } else {
    numberDisplayed = 8;
  }

  const bookImages = [book1, book2, book3, book4, book5];

  const getRandomBookImage = () => {
    const randomIndex = Math.floor(Math.random() * bookImages.length);
    return bookImages[randomIndex];
  };

  const handleArrowClick = (skill, totalCount, numberDisplayed, direction) => {
    setCurrentIndices((prev) => {
      const currentIndex = prev[skill] || 0;
      let newIndex;

      if (direction === "next") {
        newIndex =
          currentIndex + numberDisplayed < totalCount
            ? currentIndex + numberDisplayed
            : currentIndex;
      } else if (direction === "prev") {
        newIndex =
          currentIndex - numberDisplayed >= 0
            ? currentIndex - numberDisplayed
            : 0;
      }

      return { ...prev, [skill]: newIndex };
    });
  };

  const handleBookClick = (book) => {
    setSelectedBook(book); // Use the setter from props
  };

  // Determine which skills to display
  const skillsToDisplay =
    selectedSkills.length > 0
      ? selectedSkills
      : Array.from(new Set(records.flatMap((record) => record.skill)));

  const filterBooksBySkill = (skill) => {
    const filteredBooks = records.filter((record) =>
      record.skill.some(
        (s) => s.trim().toLowerCase() === skill.trim().toLowerCase()
      )
    );
    // console.log(`Books for ${skill}:`, filteredBooks); // Debug log
    return filteredBooks;
  };

  return (
    <>
      {skillsToDisplay.map((skill) => {
        const booksForSkill = filterBooksBySkill(skill);
        if (booksForSkill.length === 0) {
          return null;
        }

        const currentIndex = currentIndices[skill] || 0;
        const displayedBooks = booksForSkill.slice(
          currentIndex,
          currentIndex + numberDisplayed
        );
        const hasMore = booksForSkill.length > currentIndex + numberDisplayed;
        const hasPrevious = currentIndex > 0;

        return (
          <div key={skill} className={styles.shelfContainer}>
            <div className={styles.booksContainer}>
              {hasPrevious && (
                <img
                  src={Arrow}
                  alt='Previous books'
                  className={`${styles.arrowIcon} ${styles.arrowIconLeft}`}
                  onClick={() =>
                    handleArrowClick(
                      skill,
                      booksForSkill.length,
                      numberDisplayed,
                      "prev"
                    )
                  }
                  style={{ cursor: "pointer" }}
                />
              )}
              {displayedBooks.map((book) => (
                <div className={styles.bookItem} key={book.id}>
                  <img
                    src={getRandomBookImage()}
                    alt={book.name}
                    className={styles.bookImage}
                    onClick={() => handleBookClick(book)}
                  />
                  {/* <div className={styles.bookInfo}>
                    <span className={styles.bookName}>{book.name}</span>
                    <span className={styles.bookAuthor}>{book.author}</span>
                  </div> */}
                </div>
              ))}
              {hasMore && (
                <img
                  src={Arrow}
                  alt='More books'
                  className={styles.arrowIcon}
                  onClick={() =>
                    handleArrowClick(
                      skill,
                      booksForSkill.length,
                      numberDisplayed,
                      "next"
                    )
                  }
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
            <div className={styles.woodContainer}>
              <img src={woodenshelf} alt='Wooden Shelf' />
              <span>{skill.charAt(0).toUpperCase() + skill.slice(1)}</span>
            </div>
          </div>
        );
      })}
      {/* Removed Modal rendering */}
    </>
  );
}

export default Buk;
