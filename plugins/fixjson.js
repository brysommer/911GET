
function parseJsonSafely(jsonString) {
    const cleanedJsonString = jsonString.replace(/"review":\s*\[.*?\](?=(?:[^"]*"[^"]*")*[^"]*$),?/gs, '').replace(/&#(\d+);/g, '');

    try {
        return JSON.parse(cleanedJsonString);
    } catch (error) {
        console.log(cleanedJsonString)
        console.error('Помилка при парсінгу JSON:', error);
        return null;
    }
}

export default parseJsonSafely