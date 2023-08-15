function writeLog(str) {
    process.stdout.write(str);
    process.stdout.write('\n');
}

export { writeLog };
