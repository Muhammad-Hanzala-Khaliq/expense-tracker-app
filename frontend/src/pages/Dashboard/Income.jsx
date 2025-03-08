import React, { useEffect, useState } from "react";
import DasboardLayout from "../../components/layouts/DasboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import Model from "../../components/Model";

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddIncomeModel, setOpenAddIcomeModel] = useState(false);

  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );

      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddIncome = async (income) => {};
  const deleteIncome = async (id) => {};
  const handleDownloadIncomeDetails = async () => {};

  useEffect(() => {
    fetchIncomeDetails();

    return () => {};
  }, []);
  return (
    <DasboardLayout activeMenu="Dashboard">
      <div className="mt-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIcomeModel(true)}
            />
          </div>
        </div>

        <Model
          isOpen={openAddIncomeModel}
          onClose={() => setOpenAddIcomeModel(false)}
          title="Add Income"
        >
          <div>Add Income Form</div>
        </Model>
      </div>
    </DasboardLayout>
  );
};

export default Income;
