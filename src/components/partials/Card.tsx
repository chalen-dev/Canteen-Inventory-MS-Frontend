
type Props = {
    label?: string,
    value?: string,
} & React.HTMLAttributes<HTMLDivElement>;

export function Card({
    label = 'label',
    value = 'value',
    ...rest
                     }: Props)
{
    return (
        <div className = "card" {...rest}>
            <h1>
                {label}
            </h1>
            <p>
                {value}
            </p>
        </div>
    );
}