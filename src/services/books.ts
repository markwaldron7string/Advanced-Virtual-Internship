const BASE_URL =
  "https://us-central1-summaristt.cloudfunctions.net";

/* SELECTED BOOK */
export async function getSelectedBook() {
  const res = await fetch(
    `${BASE_URL}/getBooks?status=selected`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch selected book");
  }

  const data = await res.json();

  // API returns an array but we only want the first book
  return data[0];
}

/* RECOMMENDED BOOKS */
export async function getRecommendedBooks() {
  const res = await fetch(
    `${BASE_URL}/getBooks?status=recommended`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch recommended books");
  }

  return await res.json();
}

/* SUGGESTED BOOKS */
export async function getSuggestedBooks() {
  const res = await fetch(
    `${BASE_URL}/getBooks?status=suggested`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch suggested books");
  }

  return await res.json();
}

/* SEARCH BOOKS */
export async function searchBooks(query: string) {
  const res = await fetch(
    `${BASE_URL}/getBooksByAuthorOrTitle?search=${query}`
  );

  if (!res.ok) {
    throw new Error("Failed to search books");
  }

  return await res.json();
}