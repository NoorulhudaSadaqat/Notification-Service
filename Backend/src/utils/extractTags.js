const extractTags = (inputString) => {
  if (inputString) {
    const regex = /{([^}]+)}/g;

    const extractedTags = [];
    const matches = inputString.matchAll(regex);

    for (const match of matches) {
      const tag = match[1];
      extractedTags.push(tag);
    }

    return extractedTags;
  }
  return;
};

module.exports = { extractTags };
