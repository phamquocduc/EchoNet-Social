import { FaBars } from 'react-icons/fa'
import logo from '../../../assets/ECSlogo.png'
import { FaMagnifyingGlass, FaRegBell, FaRegMessage } from 'react-icons/fa6'
import { Tab, Tabs } from '@mui/material'
import  { useState } from 'react'
import { GroupAddOutlined, HomeOutlined, OndemandVideoOutlined, StorefrontOutlined } from '@mui/icons-material'

export default function Header() {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
    
  return (
    <header className="bg-white shadow h-12 px-6 flex items-center justify-between overflow-hidden">
      <div className="flex items-center gap-4">
        <img src={logo} alt="Logo" className="h-12 w-12" />
        <div className='flex items-center'>
          <label className="bg-[#f0f2f5] h-7.5 rounded-l-2xl w-8 flex items-center justify-center" htmlFor="search-profile">
            <FaMagnifyingGlass className="text-[#183153] h-4 w-4 pl-1" />
          </label>
          <input id='search-profile' className="text-sm bg-[#f0f2f5] h-7.5 rounded-r-2xl focus:outline-none pt-[4.5px] pb-[6px]" type="text" />
        </div>
      </div>
      <Tabs  
        sx={{
            '& .MuiTabs-flexContainer': {
            gap: '1rem', 
            },
        }} 
        value={value} 
        onChange={handleChange} 
        centered>
        <Tab 
            sx={{ padding: '12px 55px',
                borderRadius: '8px',
                ":hover": { backgroundColor: '#f0f2f5'}
            }}
            icon={<HomeOutlined className="text-[#183153] w-6 h-6"/>} />
        <Tab 
            sx={{ padding: '12px 55px',
                borderRadius: '8px',
                ":hover": { backgroundColor: '#f0f2f5'}
            }}
            icon={<GroupAddOutlined className="text-[#183153] w-6 h-6"/>} />
        <Tab 
            sx={{ padding: '12px 55px',
                borderRadius: '8px',
                ":hover": { backgroundColor: '#f0f2f5'}
            }}
            icon={<OndemandVideoOutlined className="text-[#183153] w-6 h-6"/>} />
        <Tab 
            sx={{ padding: '12px 55px',
                borderRadius: '8px',
                ":hover": { backgroundColor: '#f0f2f5'}
            }}
            icon={<StorefrontOutlined className="text-[#183153] w-6 h-6"/>} />
      </Tabs>
      <div className="flex items-center">
        <div className="flex items-center justify-center pt-[15px] pb-[15px] pl-[14px] pr-[14px]">
            <FaBars className="w-4.5 h-4.5 text-[#183153] cursor-pointer hover:text-[#0074c2]" />
        </div>
        <div className="flex items-center justify-center pt-[15px] pb-[15px] pl-[14px] pr-[14px]">
            <FaRegMessage className="w-4.5 h-4.5 text-[#183153] cursor-pointer hover:text-[#0074c2]" />
        </div>
        <div className="flex items-center justify-center pt-[14px] pb-[14px] pl-[14px] pr-[14px]">
            <FaRegBell className="w-5 h-5 text-[#183153] cursor-pointer hover:text-[#0074c2]" />
        </div>
        <div className="flex items-center justify-center pt-[8px] pb-[8px] pl-[14px] pr-[14px]">
            <img className="w-8 h-8 bg-gray-300 rounded-full cursor-pointer" alt="avatar" />
        </div>
      </div>
    </header>
  )
}