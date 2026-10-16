export function CustomBaseIcon({
    icon: Component,
    color = 'currentColor',
    size = 'var(--icon-md)',
    ...props
}) {
    return (
        <Component
        color={color}
        size={size}
        {...props}
        aria-hidden={true}
        />
    );
}