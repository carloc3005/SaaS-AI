import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"; 

interface ResponsiveDialogProps {
    title: string;
    description: string;
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}