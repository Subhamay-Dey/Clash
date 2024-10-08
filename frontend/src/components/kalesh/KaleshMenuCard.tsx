import React, { Suspense, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { Menu } from 'lucide-react';
import dynamic from 'next/dynamic';
import DeleteKalesh from './DeleteKalesh';
const EditKalesh = dynamic(() => import("./EditKalesh"));

function KaleshMenuCard({kalesh, token}:{kalesh:KaleshType, token:string}) {

    const [open, setOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      {open && (
        <Suspense fallback={<p>Loading...</p>}>
          <EditKalesh 
            open={open} 
            setOpen={setOpen} 
            kalesh={kalesh} 
            token={token}
        />
       </Suspense>
      )}
      {deleteOpen && (
        <Suspense fallback={<p>Loading...</p>}>
          <DeleteKalesh 
            open={deleteOpen} 
            setOpen={setDeleteOpen} 
            id={kalesh.id} 
            token={token}
          />
        </Suspense>
      )}
      <DropdownMenu>
      <DropdownMenuTrigger>
        <Menu />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpen(true)} className='cursor-pointer font-semibold'>Edit</DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer font-semibold'>Copy Link</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className='cursor-pointer font-semibold'>Delete</DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>
    </>

  )
}

export default KaleshMenuCard