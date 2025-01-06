import React, { useState, useContext, useEffect } from 'react';
import ColumnSelection from '../../components/dashboardPage/ColumnSelection';
import SelectNumberRows from '../../components/dashboardPage/SelectNumberRows';
import SelectRowSort from '../../components/dashboardPage/SelectRowSort';
import NavBar from '../../components/Navbar/Navbar';
import TableSearchBar from '../../components/dashboardPage/TableSearchBar';
import AddEmployeeDialog from '../../components/dashboardPage/AddEmployeeDialog';
import DashboardTable from '../../components/DashboardTable/DashboardTable';
import WithAuth from '../../context/WithAuth';
import { UserRole, AuthContext } from '../../context/AuthContext';
import { getData } from '../../api/DashboardTableAPI';

const Dashboard = () => {

  const { userRole } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  // state for showing / hiding columns
  const [showNachweise, setShowNachweise] = useState({
    nachweis1: true,
    nachweis2: true,
    nachweis3: true,
    nachweis4: true,
  });
  // States for searchbar
  const [searchQuery, setSearchQuery] = useState('');
  // State for the number of rows per page
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const options = [
    { label: "Name", value: "name" },
    { label: "Vorname", value: "vorname" },
    { label: "E-Mail", value: "email" },
    { label: "Postadresse", value: "postadresse" },
  ];
  // handleToggle function for refreshing the state of showNachweise
  const handleToggle = (nachweis) => {
    setShowNachweise((prevState) => ({
      ...prevState,
      [nachweis]: !prevState[nachweis],
    }));
  };

  // Fetch data from the backend on mount
  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      if (result) {
        setData(result);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <NavBar />
      <div className="bg-white h-full p-4 md:p-10 m-2 rounded-2xl">
        <div className="flex flex-col justify-center items-center gap-8">

          <h1 className="flex justify-center items-center font-extrabold headline">Dashboard</h1>
          {/* Column Selection */}
          <ColumnSelection showNachweise={showNachweise} handleToggle={handleToggle} />

          {/* table functionality container */}
          <div className="flex gap-6 w-full flex-col sm:gap-4 sm:flex-row items-center">
            {/* Number of Rows */}
            <div className="sm:flex-shrink-0">
              <div className="flex flex-row gap-4">
                <SelectNumberRows rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
                <SelectRowSort data={data} setData={setData} options={options} />
              </div>
            </div>

            {/* Searchbar */}
            <div className="flex gap-6 sm:gap-4 flex-col sm:flex-row sm:ml-auto">
              <TableSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              {/* Add new employee */}
              {userRole === 1 || userRole === 2 ? (
                <AddEmployeeDialog />
              ) : (
                <></>
              )}
            </div>
          </div>


          {/* table */}
          <div className="max-w-full">
            <DashboardTable
              data={data}
              setData={setData}
              loading={loading}
              showNachweise={showNachweise}
              searchQuery={searchQuery}
              rowsPerPage={rowsPerPage}
            />
          </div>
        </div>

      </div>
    </>
  );
};

export default WithAuth(Dashboard, UserRole.User);