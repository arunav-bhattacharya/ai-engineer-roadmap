export function ElectivesList({ items }: { items: string[] }) {
  return (
    <div className="block" id="electives">
      <h3>Optional electives — pick by interest, not obligation</h3>
      <ul>
        {items.map((html, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: html }} />
        ))}
      </ul>
    </div>
  );
}
