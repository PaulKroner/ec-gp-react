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
import React from "react";

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

  // Fields to dynamically render
  const fields = [
    { id: "name", label: "Name", placeholder: "Nachname", required: true },
    { id: "vorname", label: "Vorname", placeholder: "Vorname", required: true },
    { id: "email", label: "E-Mail", placeholder: "E-Mail", type: "email", required: true },
    { id: "fz_eingetragen", label: "Führungszeugnis gültig ab", type: "date" },
    { id: "fz_abgelaufen", label: "Führungszeugnis Ablaufdatum", type: "date", disabled: true },
    { id: "fz_kontrolliert_first", label: "Führungszeugnis kontrolliert von", placeholder: "Max Mustermann" },
    { id: "fz_kontrolliert_second", placeholder: "Max Mustermann" },
    { id: "fz_kontrolliert_am", label: "Führungszeugnis kontrolliert am", type: "date" },
    { id: "gs_eingetragen", label: "Grundlagenschulung gültig ab", type: "date" },
    { id: "gs_erneuert", label: "Grundlagenschulung erneuert am", type: "date", disabled: gsDisabled },
    { id: "gs_kontrolliert", label: "Grundlagenschulung kontrolliert von", placeholder: "Max Mustermann" },
    { id: "us_eingetragen", label: "Upgradeschulung gültig ab", type: "date" },
    { id: "us_abgelaufen", label: "Upgradeschulung Ablaufdatum", type: "date", disabled: true },
    { id: "us_kontrolliert", label: "Upgradeschulung kontrolliert von", placeholder: "Max Mustermann" },
    { id: "sve_eingetragen", label: "Selbstverpflichtungserklärung gültig ab", type: "date" },
    { id: "sve_kontrolliert", label: "Selbstverpflichtungserklärung kontrolliert", placeholder: "Max Mustermann" },
  ];


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

            {fields.map(({ id, label, ...rest }, index) => {
              // Insert custom code at a specific position (e.g., after "fz_eingetragen")
              if (id === "email") {
                return (
                  <React.Fragment key={id}>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor={id} className={rest.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
                        {label}
                      </Label>
                      <Input id={id} value={formData[id] || ""} onChange={handleChange} {...rest} />

                    </div>
                    <PostalAdress formData={formData} setFormData={setFormData} />
                  </React.Fragment>
                );
              };

              if (id === "fz_eingetragen") {
                return (
                  <React.Fragment key={id}>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor={id} className={rest.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
                        {label}
                      </Label>
                      <Input id={id} value={formData[id] || ""} onChange={handleChange} {...rest} />

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
                  </React.Fragment>
                );
              }
              if (id === "fz_kontrolliert_first") {
                return (
                  <React.Fragment key={id}>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor={id} className={rest.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
                        {label}
                      </Label>
                      <Input id={id} value={formData[id] || ""} onChange={handleChange} {...rest} />
                      <span className="col-span-1 leading-none font-medium text-xs text-muted-foreground">
                        <div className="flex flex-col">
                          <div>Es müssen zwei Personen kontrolliert haben. Vor- und Nachname erforderlich!</div>
                        </div>
                      </span>
                    </div>
                  </React.Fragment>
                );
              }

              // Render default field layout
              return (
                <div key={id} className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor={id} className={rest.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
                    {label}
                  </Label>
                  <Input id={id} value={formData[id] || ""} onChange={handleChange} {...rest} />
                </div>
              );
            })}

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
