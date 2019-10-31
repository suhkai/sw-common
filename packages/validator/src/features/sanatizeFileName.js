function sanitizeFileName(name) {
    return name.replace(/[\0?*+]/g, '_');
}

//https://stackoverflow.com/questions/1976007/what-characters-are-forbidden-in-windows-and-linux-directory-names
// not really windows friendly path fragging, use path.parse and path.format and examine the 'root' element
function isPlainPathFragment(name) {
    // not starting with "/", "./", "../"
    return (
        name[0] !== '/' &&
        !(name[0] === '.' && (name[1] === '/' || name[1] === '.')) &&
        sanitizeFileName(name) === name
    );
}

module.exports = {
    sanitizeFileName,
    isPlainPathFragment
};
