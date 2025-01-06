import { Input } from "../ui/input";

const TableSearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="">
      <Input
        type="text"
        placeholder="Suche"
        className="w-60 p-2 border-2 border-ec rounded-lg"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}

export default TableSearchBar;