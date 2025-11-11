import React from "react";
import Card from "../components/ui/card";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-4">Perfil</h2>
      <Card>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="type-subtle text-gray-500">Nome</div>
            <div className="font-medium">{user?.name}</div>
          </div>
          <div>
            <div className="type-subtle text-gray-500">Email</div>
            <div className="font-medium">{user?.email}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
