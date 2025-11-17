import React, { useState } from 'react';
import { User, Mail, Phone, ExternalLink } from 'lucide-react';
import FormField from '../ui/formfield';
import Button from '../ui/button';

const ContatosSection = ({ contatos = [], onAddContato, containerId = "contatos-section" }) => {
  const [novoContato, setNovoContato] = useState({
    nome: '',
    email: '',
    telefone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoContato((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (novoContato.nome.trim()) {
      onAddContato({ ...novoContato });
      setNovoContato({ nome: '', email: '', telefone: '' });
    }
  };

  return (
    <div id={containerId} className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">Contatos Relacionados</h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <FormField label="Nome *" htmlFor="nome">
          <div className="relative">
            <User className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              id="nome"
              type="text"
              name="nome"
              value={novoContato.nome}
              onChange={handleChange}
              required
              className="pl-7 w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </FormField>
        <FormField label="E-mail" htmlFor="email">
          <div className="relative">
            <Mail className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              id="email"
              type="email"
              name="email"
              value={novoContato.email}
              onChange={handleChange}
              className="pl-7 w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </FormField>
        <FormField label="Telefone" htmlFor="telefone">
          <div className="relative">
            <Phone className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              id="telefone"
              type="tel"
              name="telefone"
              value={novoContato.telefone}
              onChange={handleChange}
              className="pl-7 w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </FormField>
        <div className="md:col-span-3 flex justify-end">
          <Button
            type="submit"
            variant="charcoal"
            aria-label="Adicionar contato"
            disabled={!novoContato.nome.trim()}
            className="text-sm"
          >
            Adicionar Contato
          </Button>
        </div>
      </form>

      {contatos.length > 0 && (
        <div className="mt-4 space-y-2">
          {contatos.map((c, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={14} className="text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium">{c.nome}</p>
                {c.email && (
                  <p className="type-caption">
                    <a
                      href={`mailto:${c.email}`}
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      aria-label={`Enviar e-mail para ${c.nome}`}
                    >
                      {c.email}
                      <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  </p>
                )}
                {c.telefone && (
                  <p className="type-caption">
                    <a
                      href={`tel:${c.telefone.replace(/\D/g,'')}`}
                      className="text-blue-600 hover:underline"
                      aria-label={`Ligar para ${c.nome}`}
                    >
                      {c.telefone}
                    </a>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContatosSection;