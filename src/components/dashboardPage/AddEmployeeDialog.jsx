import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../../hooks/use-toast";
import { useState } from "react";
import { calculateExpirationDate } from "../../lib/utils";
import ModalSubmitButton from "../ModalSubmitButton";
import { InsertEmployee } from "../../api/DashboardPageAPI";
import PostalAdress from "../PostalAdress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"

const AddEmployeeDialog = () => {

  const { toast } = useToast();

  // State for the AddEmployee-Dialog
  const [formData, setFormData] = useState({
    name: "",
    vorname: "",
    email: "",
    postadresse: "",
    fz_eingetragen: "",
    fz_abgelaufen: "",
    fz_kontrolliert: "",
    fz_kontrolliert_am: "",
    gs_eingetragen: "",
    gs_erneuert: "",
    gs_kontrolliert: "",
    us_eingetragen: "",
    us_abgelaufen: "",
    us_kontrolliert: "",
    sve_eingetragen: "",
    sve_kontrolliert: "",
    fz_kontrolliert_first: '',
    fz_kontrolliert_second: '',
    hauptamt: false,
  });

  // const [fz_kontrolliert_first, setFzKontrolliertFirst] = useState('');
  // const [fz_kontrolliert_second, setFzKontrolliertSecond] = useState('');
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState('');
  const [gsDisabled, setGsDisabled] = useState(true);
  const [activeButton, setActiveButton] = useState(null); // State to track the active button
  const [hauptamt, setHauptamt] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    let newValue = value;

    if (id === "name" || id === "vorname" || (id.includes("_kontrolliert") && id !== "fz_kontrolliert_am")) {
      // Allow only letters and spaces (including German special characters)
      newValue = value.replace(/[^a-zA-ZäöüÄÖÜß\s-]/g, '');

      // Capitalize the first letter of each word
      newValue = newValue
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    // Convert email to lowercase
    if (id === "email") {
      newValue = value.toLowerCase();
    }

    if (id === 'fz_eingetragen') {
      let year = hauptamt ? 3 : 5;
      const newFzAbgelaufen = calculateExpirationDate(value, year);
      setFormData((prevData) => ({
        ...prevData,
        [id]: newValue,
        fz_abgelaufen: newFzAbgelaufen,
      }));
    } else if (id === 'us_eingetragen') {
      const newUsAbgelaufen = calculateExpirationDate(value, 1);
      setFormData((prevData) => ({
        ...prevData,
        [id]: newValue,
        us_abgelaufen: newUsAbgelaufen,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: newValue,
      }));
    }

    if (id === "gs_eingetragen") {
      setGsDisabled(false);
    }
  };


  // replace "" with null for all fields except name, vorname and email
  const transformFormData = (formData) => {
    return Object.fromEntries(
      Object.entries(formData).map(([key, value]) => {
        if (["name", "vorname", "email"].includes(key)) {
          return [key, value];
        }
        return [key, value === "" ? null : value];
      })
    );
  };

  // validate every field and then execute the InsertEmployee function
  const validateAndInsertEmployee = (e) => {
    e.preventDefault();
    setLoading(true);
    const year2000 = new Date('2000-01-01');

    // Check if any required field is empty
    if (formData.name === "" || formData.vorname === "" || formData.email === "") {
      toast({
        variant: "destructive",
        description: "Bitte füllen Sie die Pflichtfelder Name, Vorname und E-Mail aus.",
      });
      setLoading(false);
      return; // Exit early
    }

    // Check for invalid dates
    const invalidFields = [];
    const fieldsToCheck = [
      { key: 'fz_eingetragen', label: 'Führungszeugnis gültig ab' },
      { key: 'gs_eingetragen', label: 'Grundlagenschulung gültig ab' },
      { key: 'us_eingetragen', label: 'Upgradeschulung gültig ab' },
      { key: 'sve_eingetragen', label: 'Selbstverpflichtungserklärung gültig ab' },
    ];

    fieldsToCheck.forEach(({ key, label }) => {
      if (new Date(formData[key]) <= year2000) {
        invalidFields.push(label);
      }
    });

    if (invalidFields.length > 0) {
      const errorMessage = `Das Datum ist falsch eingetragen: ${invalidFields.join(', ')}`;
      setDateError(errorMessage);
      toast({
        variant: "destructive",
        description: errorMessage, // Display the date error message
      });
      setLoading(false);
      return; // Exit early
    } else {
      setDateError('');
      setLoading(false);
    }

    const fz_kontrolliert = `${formData.fz_kontrolliert_first.trim()} ${formData.fz_kontrolliert_second.trim()}`.trim();
    const { fz_kontrolliert_first, fz_kontrolliert_second, ...dataToSubmit } = formData;
    const transformedFormData = transformFormData({
      ...dataToSubmit,
      fz_kontrolliert
    });

    InsertEmployee(transformedFormData, toast, setLoading)
  }

  // Hauptamt button
  const handleButtonClick = (button) => {
    const isHauptamt = button === 'yes';
    setHauptamt(isHauptamt); // Set hauptamt based on the button clicked
    setActiveButton(button); // Update active button state

    // Update formData.hauptamt
    setFormData((prevData) => ({
      ...prevData,
      hauptamt: isHauptamt, // Set hauptamt in formData based on button clicked
    }));

    // Recalculate newFzAbgelaufen if fz_eingetragen is in formData
    if (formData.fz_eingetragen) {
      const year = isHauptamt ? 3 : 5;
      const newFzAbgelaufen = calculateExpirationDate(formData.fz_eingetragen, year);
      setFormData((prevData) => ({
        ...prevData,
        fz_abgelaufen: newFzAbgelaufen,
      }));
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="" className="gap-3 w-60">
            <p>
              Mitarbeiter hinzufügen
            </p>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-y-scroll max-h-screen">
          <DialogHeader>
            <DialogTitle>Mitarbeiter hinzufügen</DialogTitle>
            <DialogDescription>

            </DialogDescription>
          </DialogHeader>
          <section>
            <div>Hier können Sie einen neuen Mitarbeiter hinzufügen.</div>
            <div className="flex flex-row">
              Achtung:
              <span className="ml-1"></span>
              <span className="after:content-['*'] after:ml-0.5 after:text-red-500">Felder</span>
              <span className="ml-1"></span>
              sind Pflichtfelder!
            </div>
          </section>

          <form className="grid gap-3 py-4" onSubmit={validateAndInsertEmployee}>
            {/* Name Field */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="name" className="after:content-['*'] after:ml-0.5 after:text-red-500">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className=""
                placeholder="Nachname"
                required
              />
            </div>
            {/* Vorname Field */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="vorname" className="after:content-['*'] after:ml-0.5 after:text-red-500">Vorname</Label>
              <Input
                type="text"
                id="vorname"
                value={formData.vorname}
                onChange={handleChange}
                className=""
                placeholder="Vorname"
                required
              />
            </div>
            {/* Email Field */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="email" className="after:content-['*'] after:ml-0.5 after:text-red-500">E-Mail</Label>
              <Input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className=""
                placeholder="E-Mail"
                required
              />
            </div>
            {/* Postadresse Field */}
            <PostalAdress formData={formData} setFormData={setFormData} />
            {/* Führungszeugnis Fields */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="fz_eingetragen">Führungszeugnis gültig ab</Label>
              <Input
                type="date"
                id="fz_eingetragen"
                value={formData.fz_eingetragen}
                onChange={handleChange}
                className=""
              />
              <span className="col-span-1 leading-none font-medium text-xs text-muted-foreground">
                <div className="flex flex-col">
                  <div className="flex flex-row">
                    <div>Klicken Sie auf</div>
                    <span className="ml-1"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                      <path fillRule="evenodd" d="M4 1.75a.75.75 0 0 1 1.5 0V3h5V1.75a.75.75 0 0 1 1.5 0V3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2V1.75ZM4.5 6a1 1 0 0 0-1 1v4.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-7Z" clipRule="evenodd" />
                    </svg>
                    <div>,</div>
                    <span className="ml-1"></span>
                  </div>
                  <div>um ein Datum einzutragen</div>
                </div>
              </span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="fz_abgelaufen">Führungszeugnis Ablaufdatum</Label>
              <Input
                type="date"
                id="fz_abgelaufen"
                value={formData.fz_abgelaufen}
                onChange={handleChange}
                className=""
                disabled
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="fz_kontrolliert">Führungszeugnis kontrolliert von</Label>
              <Input
                type="text"
                id="fz_kontrolliert_first"
                value={formData.fz_kontrolliert_first}
                onChange={handleChange}
                className=""
                placeholder="Max Mustermann"
              />
              <span className="col-span-1 leading-none font-medium text-xs text-muted-foreground">
                <div className="flex flex-col">
                  <div>Es müssen zwei Personen kontrolliert haben. Vor- und Nachname erforderlich!</div>
                </div>
              </span>

              <div className="col-span-1"></div>

              <Input
                type="text"
                id="fz_kontrolliert_second"
                value={formData.fz_kontrolliert_second}
                onChange={handleChange}
                className=""
                placeholder="Max Mustermann"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="fz_kontrolliert_am">Führungszeugnis kontrolliert am</Label>
              <Input
                type="date"
                id="fz_kontrolliert_am"
                value={formData.fz_kontrolliert_am}
                onChange={handleChange}
                className=""
              />
            </div>
            {/* Grundlagenschulung Fields */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="gs_eingetragen">Grundlagenschulung gültig ab</Label>
              <Input
                type="date"
                id="gs_eingetragen"
                value={formData.gs_eingetragen}
                onChange={handleChange}
                className=""
              />

              <Popover>
                <PopoverTrigger className="">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg></PopoverTrigger>
                <PopoverContent className="text-sm">
                  <span className="flex flex-row items-center">
                    <div>Klicken sie auf  </div>
                    <span className="ml-1"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                      <path fillRule="evenodd" d="M4 1.75a.75.75 0 0 1 1.5 0V3h5V1.75a.75.75 0 0 1 1.5 0V3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2V1.75ZM4.5 6a1 1 0 0 0-1 1v4.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-7Z" clipRule="evenodd" />
                    </svg>
                    <div>, um</div>
                  </span>
                  <div>ein Datum einzugeben</div>
                </PopoverContent>
              </Popover>

            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="gs_erneuert">Grundlagenschulung erneuert am</Label>
              <Input
                type="date"
                id="gs_erneuert"
                value={formData.gs_erneuert}
                onChange={handleChange}
                className=""
                disabled={gsDisabled}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="gs_kontrolliert">Grundlagenschulung kontrolliert von</Label>
              <Input
                type="text"
                id="gs_kontrolliert"
                value={formData.gs_kontrolliert}
                onChange={handleChange}
                className=""
                placeholder="Max Mustermann"
              />
            </div>
            {/* Upgradeschulung Fields */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="us_eingetragen">Upgradeschulung gültig ab</Label>
              <Input
                type="date"
                id="us_eingetragen"
                value={formData.us_eingetragen}
                onChange={handleChange}
                className=""
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="us_abgelaufen">Upgradeschulung Ablaufdatum</Label>
              <Input
                type="date"
                id="us_abgelaufen"
                value={formData.us_abgelaufen}
                onChange={handleChange}
                className=""
                disabled
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="us_kontrolliert">Upgradeschulung kontrolliert von</Label>
              <Input
                type="text"
                id="us_kontrolliert"
                value={formData.us_kontrolliert}
                onChange={handleChange}
                className=""
                placeholder="Max Mustermann"
              />
            </div>
            {/* Selbstverpflichtungserklärung Fields */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="sve_eingetragen">Selbstverpflichtungserklärung gültig ab</Label>
              <Input
                type="date"
                id="sve_eingetragen"
                value={formData.sve_eingetragen}
                onChange={handleChange}
                className=""
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="sve_kontrolliert" className="col-span-1">Selbstverpflichtungserklärung kontrolliert</Label>
              <Input
                type="text"
                id="sve_kontrolliert"
                value={formData.sve_kontrolliert}
                onChange={handleChange}
                className=""
                placeholder="Max Mustermann"
              />
            </div>
            {/* Hauptamt */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="sve_kontrolliert" className="col-span-1">Hauptamt</Label>
              <div className="flex flex-row justify-around items-center">
                <Button
                  className={`bg-white text-black w-16 rounded-md hover:bg-lime-200 border-ec border-2 ${activeButton === 'yes' ? 'bg-ec hover:bg-ec' : ''}`}
                  onClick={(event) => {
                    event.preventDefault(); // Prevent the form from submitting
                    handleButtonClick('yes'); // Set 'yes' button as active
                  }}
                >
                  Ja
                </Button>
                <Button
                  className={`bg-white text-black w-16 rounded-md hover:bg-lime-200 border-ec border-2 ${activeButton === 'no' ? 'bg-ec hover:ge-ec' : ''}`}
                  onClick={(event) => {
                    event.preventDefault(); // Prevent the form from submitting
                    handleButtonClick('no'); // Set 'no' button as active
                  }}
                >
                  Nein
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button className="px-0" type="submit">
                <ModalSubmitButton text="Mitarbeiter hinzufügen" loading={loading} />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
};

export default AddEmployeeDialog;
