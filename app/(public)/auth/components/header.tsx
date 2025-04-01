interface HeaderProps {
	label: string;
}

export const Header = ({ label }: HeaderProps) => {
	return (
		<div className="flex w-full flex-col items-center justify-center gap-y-4">
			<p className="text-muted-foreground text-sm">{label}</p>
		</div>
	);
};
