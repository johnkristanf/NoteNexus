import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Ellipsis, ExternalLink, Trash2 } from 'lucide-react'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface StickyNoteOtionsProps {
    onOpenNote: () => void
    onDeleteNote: () => void
}

export default function StickyNoteOtions({ onOpenNote, onDeleteNote }: StickyNoteOtionsProps) {
    return (
        <Popover>
            <PopoverTrigger>
                {' '}
                <Ellipsis className="size-5" />
            </PopoverTrigger>
            <PopoverContent className="w-32 flex flex-col !p-2">
                {/* EDIT CHAT */}
                <div
                    className="flex items-center gap-2 mb-3 hover:cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                    onClick={onOpenNote}
                >
                    <ExternalLink className="size-4" />
                    <h1 className="text-xs ">Open Note</h1>
                </div>

                {/* DELETE CHAT */}
                <AlertDialog>
                    <AlertDialogTrigger>
                        {' '}
                        <div className="flex items-center gap-2 text-red-800 hover:cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                            <Trash2 className="size-4" />
                            <h1 className="text-xs">Delete Note</h1>
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="hover:!cursor-pointer">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={onDeleteNote}
                                className="bg-red-800 hover:!cursor-pointer hover:!opacity-75"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </PopoverContent>
        </Popover>
    )
}
