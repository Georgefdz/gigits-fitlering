export const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    border: "2px solid #76b39d",
    borderRadius: "12px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "rgb(6, 144, 103)" : "transparent",
    color: state.isSelected ? "rgb(6, 144, 103)" : "white",
    ":hover": { backgroundColor: "#76b39d" },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#76b39d",
    borderRadius: "4px",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    border: "2px solid #76b39d",
  }),
};
