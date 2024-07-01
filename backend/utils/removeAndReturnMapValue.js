export default function removeRandomEntry (map) {

    const iterator = map.entries();
    const steps = Math.floor(Math.random() * map.size);
    let result;
    for (let i = 0; i <= steps; i++) {
        result = iterator.next().value;
    }
    const [key, value] = result;
    map.delete(key);
    return key;
}