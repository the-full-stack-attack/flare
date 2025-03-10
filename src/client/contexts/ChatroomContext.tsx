import React from "react";

type ChatroomContextType = string
type ToggleDJContextType = () => void; // A function that toggles DJ mode
type DataContextType = any; 

const ChatroomContext = React.createContext<ChatroomContextType | undefined>(undefined);
const ToggleDJContext = React.createContext<ToggleDJContextType | undefined>(undefined);
const DataContext = React.createContext<DataContextType | null>(null);

export { ChatroomContext, ToggleDJContext, DataContext };