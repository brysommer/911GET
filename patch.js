import fs from 'fs';
import shopUrls from './linksDb.js';


// Виділяємо текст після останнього символу '/'
const lastSegments = shopUrls.map(url => {
    const parts = url.split('/');
    return parts[parts.length - 1];
});

// Створюємо масив з унікальними значеннями за допомогою методу filter
const uniqueSegments = lastSegments.filter((value, index, self) => {
    return self.indexOf(value) === index;
});

// Генеруємо JavaScript-масив з лапками та переносами після кожного елементу
const jsArrayContent = `const uniqueSegments = [\n  "${uniqueSegments.join('",\n  "')}"\n];\n`;

// Записуємо масив у файл
fs.writeFile('uniqueSegments.js', jsArrayContent, (err) => {
    if (err) throw err;
    console.log('Файл успішно записан!');
});