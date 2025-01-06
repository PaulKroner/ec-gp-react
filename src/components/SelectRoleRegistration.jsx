import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

const SelectRoleRegistration = ({ setRole }) => {

  return (
    <>
      <Select onValueChange={(value) => setRole(parseInt(value, 10))}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Wählen Sie eine Rolle" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Admin</SelectItem>
          <SelectItem value="2">Mitarbeiter</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectRoleRegistration;