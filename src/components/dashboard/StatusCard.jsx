import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function StatusCard({ title, value, icon: Icon, color, trend, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
        >
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 group">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <p className="text-gray-400 text-sm font-medium">{title}</p>
                            <p className="text-2xl font-bold text-white">{value}</p>
                            {trend && (
                                <p className="text-xs text-gray-500">{trend}</p>
                            )}
                        </div>
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${color} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className={`w-6 h-6 bg-gradient-to-r ${color} bg-clip-text text-transparent`} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}