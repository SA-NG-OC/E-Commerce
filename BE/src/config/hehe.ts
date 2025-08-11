function trailingZeroes(n: number): number {
    let a: number = 0;
    let x: number;
    let kq: number = 1;
    for (let i = 1; i <= n; i++) {
        kq = kq * i;
        while (kq % 10 === 0) {
            kq = kq / 10;
            a = a + 1;
            console.log(a);
        }
        i++;
        kq = kq % 10;
    }
    return a;
};

console.log(trailingZeroes(5));