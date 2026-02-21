/**
 * Header Component
 * Displays CarbonChain Pro branding and navigation
 */

export function Header() {
  return (
    <div className="text-center py-12 mb-12">
      <h1 className="text-5xl font-bold mb-2">
        <span className="text-gradient">CarbonChain Pro</span>
      </h1>
      <p className="text-text-secondary text-lg">
        Supply chain carbon footprint & net-zero alignment
      </p>
    </div>
  );
}

export default Header;
