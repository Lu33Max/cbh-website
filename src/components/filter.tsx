import React, {useState} from 'react'

const Filter: React.FC = () => {

  const [selectedValue, setSelectedValue] = useState('')
  const [selectedValue2, setSelectedValue2] = useState('')


  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value)
  }
  const handleSelectChange2 = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue2(event.target.value)
  }

  return (
    <div className='bg-white mx-5'>
    <div className='flex flex-row px-5 py-2 font-body font-poppins text-2xl font-thin'>
      <select name="col" id="col" onChange={handleSelectChange}>
          <option value={'CBH_Donor_ID'}>CBH_Donor_ID</option>
          <option value={'CBH_Master_ID'}>CBH_Master_ID</option>
          <option value={'CBH_Sample_ID'}>CBH_Sample_ID</option>
          <option value={'Price'}>Price</option>
          <option value={'Quantity'}>Quantity</option>
          <option value={'Unit'}>Unit</option>
          <option value={'Matrix'}>Matrix</option>
          <option value={'Storage_Temperature'}>Storage_Temperature</option>
          <option value={'Freeze_Thaw_Cycles'}>Freeze_Thaw_Cycles</option>
          <option value={'Sample_Condition'}>Sample_Condition</option>
          <option value={'Infectious_Disease_Test_Result'}>Infectious_Disease_Test_Result</option>
          <option value={'Gender'}>Gender</option>
          <option value={'Age'}>Age</option>
          <option value={'Ethnicity'}>Ethnicity</option>
          <option value={'BMI'}>BMI</option>
          <option value={'Lab_Parameter'}>Lab_Parameter</option>
          <option value={'Result_Interpretation'}>Result_Interpretation</option>
          <option value={'Result_Raw'}>Result_Raw</option>
          <option value={'Result_Numerical'}>Result_Numerical</option>
          <option value={'Result_Unit'}>Result_Unit</option>
          <option value={'Cut_Off_Raw'}>Cut_Off_Raw</option>
          <option value={'Cut_Off_Numerical'}>Cut_Off_Numerical</option>
          <option value={'Test_Method'}>Test_Method</option>
          <option value={'Test_System'}>Test_System</option>
          <option value={'Test_System_Manufacturer'}>Test_System_Manufacturer</option>
          <option value={'Result_Obtained_From'}>Result_Obtained_From</option>
          <option value={'Diagnosis'}>Diagnosis</option>
          <option value={'Diagnosis_Remarks'}>Diagnosis_Remarks</option>
          <option value={'ICD_Code'}>ICD_Code</option>
          <option value={'Pregnancy_Week'}>Pregnancy_Week</option>
          <option value={'Pregnancy_Trimester'}>Pregnancy_Trimester</option>
          <option value={'Medication'}>Medication</option>
          <option value={'Therapy'}>Therapy</option>
          <option value={'Histological_Diagnosis'}>Histological_Diagnosis</option>
          <option value={'Organ'}>Organ</option>
          <option value={'Disease_Presentation'}>Disease_Presentation</option>
          <option value={'TNM_Class_T'}>TNM_Class_T</option>
          <option value={'TNM_Class_N'}>TNM_Class_N</option>
          <option value={'TNM_Class_M'}>TNM_Class_M</option>
          <option value={'Tumour_Grade'}>Tumour_Grade</option>
          <option value={'Tumour_Stage'}>Tumour_Stage</option>
          <option value={'Viable_Cells__per_'}>Viable_Cells__per_</option>
          <option value={'Necrotic_Cells__per_'}>Necrotic_Cells__per_</option>
          <option value={'Tumour_Cells__per_'}>Tumour_Cells__per_</option>
          <option value={'Proliferation_Rate__Ki67_per_'}>Proliferation_Rate__Ki67_per_</option>
          <option value={'Estrogen_Receptor'}>Estrogen_Receptor</option>
          <option value={'Progesteron_Receptor'}>Progesteron_Receptor</option>
          <option value={'HER_2_Receptor'}>HER_2_Receptor</option>
          <option value={'Other_Gene_Mutations'}>Other_Gene_Mutations</option>
          <option value={'Country_of_Collection'}>Country_of_Collection</option>
          <option value={'Date_of_Collection'}>Date_of_Collection</option>
          <option value={'Procurement_Type'}>Procurement_Type</option>
          <option value={'Informed_Consent'}>Informed_Consent</option>
        </select>
        <select className='mr-10' onChange={handleSelectChange2}>
            <option value={'in'}>in</option>
            <option value={'equal'}>equal</option>
            <option value={'less'}>less</option>
            <option value={'more'}>more</option>
            <option value={'between'}>between</option>
        </select>
        <button className='bg-red-600 text-white'>delete</button>
    </div>
    <div className='flex flex-row px-5 py-2 font-body font-poppins text-2xl font-thin'>
      <div className='mr-2'>
        {selectedValue && (
          <div>{selectedValue}</div>
        )}
      </div>
      <div>
        {selectedValue2 && (
          <div>{selectedValue2}</div>
        )}
        
      </div>
    </div>
    {/*
    <div>
    <span className={`bg-[rgb(174,207,150)] justify-center mx-1 rounded-lg px-3 py-2 ${filter.matrix.length > 0 ? "" : "hidden"}`}>
             {filter.matrix.map((item, i) => (
              <>
                {(i !== 0) ? (<>, {item}</>) : (<>{item}</>)}
              </>
            ))}
    </span>
    </div>
    */}
    </div>
    
  )
}

export default Filter
