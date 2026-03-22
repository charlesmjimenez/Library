// ELEMENTS
const OPEN_DIALOG = document.querySelector(".book-button");
const DIALOG = document.querySelector("#book-form-container");
const CLOSE_BUTTON = document.querySelector("#close-button");
const BOOK_FORM = document.querySelector(".book-form");
const BOOK_CONTAINER = document.querySelector(".book-container");
const NEW_BOOK_TITLE = document.querySelector(".new-book-title");

const AUTHOR = document.querySelector("#author");
const TITLE = document.querySelector("#title");
const PAGES = document.querySelector("#pages");

const myLibrary = [];

function Book(author, title, pages, hasRead) {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }

  this.id = crypto.randomUUID();
  this.author = author;
  this.title = title;
  this.pages = pages;
  this.hasRead = hasRead;
}

Book.prototype.toggleRead = function () {
  this.hasRead = !this.hasRead;
};

// Core functionality

function AddBookToLibrary(author, title, pages, hasRead) {
  const book = new Book(author, title, pages, hasRead);
  myLibrary.push(book);

  return book;
}

function RenderLibrary() {
  // first remove the child elements
  while (BOOK_CONTAINER.firstChild) {
    BOOK_CONTAINER.removeChild(BOOK_CONTAINER.firstChild);
  }

  myLibrary.forEach((book) => {
    const card = createElement("div", null, "book-card");
    card.setAttribute("data-id", book.id);

    const title = createElement("h3", `${book.title}`, null);
    const horizontalLine = createElement("hr", null, null);
    const author = createElement("p", `Author: ${book.author}`, null);
    const pages = createElement("p", `Pages: ${book.pages}`, null);
    const hasRead = createElement(
      "p",
      `Status: ${book.hasRead ? "Read" : "Not Read"}`,
      null,
    );

    const buttonContainer = createElement("div", null, "card-button-container");
    const removeButton = createElement("button", "Remove", "remove-button");
    const toggleReadButton = createElement(
      "button",
      "Toggle Read",
      "hasRead-button",
    );

    buttonContainer.appendChild(removeButton);
    buttonContainer.appendChild(toggleReadButton);

    card.appendChild(title);
    card.appendChild(horizontalLine);
    card.appendChild(author);
    card.appendChild(pages);
    card.appendChild(hasRead);
    card.appendChild(buttonContainer);

    BOOK_CONTAINER.appendChild(card);
  });
}

function createElement(element, text, className) {
  const el = document.createElement(element);
  if (text) {
    el.textContent = text;
  }
  if (className) {
    el.classList.add(className);
  }

  return el;
}

function RemoveBook(id) {
  // remove the element by index - wasn't sure how to remove by element without using a for loop or the delete operator
  const bookId = myLibrary.findIndex((book) => book.id === id);

  if (bookId !== -1) {
    myLibrary.splice(bookId, 1);
  }
}

// ---------------------------------------------
// UI HELPER
function ResetFields() {
  AUTHOR.value = "";
  TITLE.value = "";
  PAGES.value = "";
  document.querySelector('input[name="read-book"]:checked').checked = false;
}

function CloseDialog() {
  DIALOG.close();
}

// ---------------------------------------------

OPEN_DIALOG.addEventListener("click", (e) => {
  NEW_BOOK_TITLE.textContent = `New Book (${myLibrary.length})`;
  DIALOG.showModal();
});

CLOSE_BUTTON.addEventListener("click", () => {
  CloseDialog();
});

BOOK_FORM.addEventListener("submit", (event) => {
  event.preventDefault();
  const HAS_READ = document.querySelector('input[name="read-book"]:checked');

  const userAuthor = AUTHOR.value;
  const userTitle = TITLE.value;
  const userPages = PAGES.value;
  const hasRead = HAS_READ.value === "yes" ? true : false;
  console.log(HAS_READ);
  if (AddBookToLibrary(userAuthor, userTitle, userPages, hasRead)) {
    ResetFields();
  }
  CloseDialog();
  RenderLibrary();
});

document.querySelector(".book-container").addEventListener("click", (e) => {
  const id = e.target.parentElement.parentElement.dataset.id;

  const book = myLibrary.find((book) => book.id === id);
  console.log(book);
  // dont handle any logic if book doesn't exist
  if (!book) {
    return;
  }

  if (e.target.className == "remove-button") {
    RemoveBook(id);
  }
  if (e.target.className == "hasRead-button") {
    book.toggleRead();
  }
  RenderLibrary();
});
