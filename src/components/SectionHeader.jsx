export default function SectionHeader({ eyebrow, title }) {
    return (
        <div className="section-header">
            <span className="section-subtitle">{eyebrow}</span>
            <h2 className="section-title">{title}</h2>
        </div>
    );
}
