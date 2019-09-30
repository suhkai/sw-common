export default function syncWithAnimationFrame<T extends Function>(fn: T): T {
    let _args: any[] | undefined;
    function execute() {
        fn(...(_args || []));
        _args = undefined;
    }
    return <any>function (...args: any[]) {
        if (!_args) {
            requestAnimationFrame(execute);
        }
        _args = args;
    }
}