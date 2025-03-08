import React, { useEffect, useState } from "react";
import DasboardLayout from "../../components/layouts/DasboardLayout";
import { userUserAuth } from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import InfoCard from "../../components/Cards/InfoCard";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { addThousandsSperator } from "../../utils/helper";
import RecentTransactions from "../../components/Dasboard/RecentTransactions";
import FinanceOverview from "../../components/Dasboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dasboard/ExpenseTransactions";
import Last30DaysExpense from "../../components/Dasboard/Last30DaysExpense";
import RecentIncomeWithChart from "../../components/Dasboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dasboard/RecentIncome";

const Home = () => {
  userUserAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  // console.log(dashboardData);
  const [loading, setLoading] = useState(false);
  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong.Please try again", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    return () => {};
  }, []);

  return (
    <DasboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSperator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSperator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandsSperator(dashboardData?.totalExpense || 0)}
            color="bg-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData?.recentTransaction}
            onSeeMore={() => navigate("/expense")}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpense || 0}
          />

          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transaction || []}
            onSeeMore={() => navigate("/expense")}
          />

          <Last30DaysExpense
            data={dashboardData?.last30DaysExpenses?.transaction || []}
          />

          <RecentIncomeWithChart
            data={
              dashboardData?.last60DaysIncome?.transaction?.slice(0, 4) || []
            }
            totalIncome={dashboardData?.totalIncome || 0}
          />

          <RecentIncome
            transactions={dashboardData?.last60DaysIncome?.transaction}
            onSeeMore={() => navigate("/income")}
          />
        </div>
      </div>
    </DasboardLayout>
  );
};

export default Home;
