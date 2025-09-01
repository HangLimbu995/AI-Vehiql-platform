import React from "react";
import SettingsFrom from "./_components/settings-form";
import SettingsForm from "./_components/settings-form";

const SettingsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings Page</h1>
      <SettingsForm/>
    </div>
  );
};

export default SettingsPage;
