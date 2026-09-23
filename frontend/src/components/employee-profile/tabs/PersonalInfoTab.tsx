import React, { useState } from 'react';
import { EmployeeDto } from '../../../api/employees';
import { useUpdateEmployeeProfile } from '../../../hooks/useEmployee';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Edit2, Save, X } from 'lucide-react';

export default function PersonalInfoTab({ employee }: { employee: EmployeeDto }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: employee.fullName || '',
    phone: employee.phone || '',
    dateOfBirth: employee.dateOfBirth || '',
    address: employee.address || '',
    cinNumber: employee.cinNumber || '',
    nationality: employee.nationality || '',
  });

  const updateProfile = useUpdateEmployeeProfile();

  const handleSave = () => {
    updateProfile.mutate({ id: employee.id, data: formData }, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
          <p className="text-sm text-slate-500">Basic identity and contact details.</p>
        </div>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Info
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={updateProfile.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {updateProfile.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Full Name</label>
          {isEditing ? (
            <Input name="fullName" value={formData.fullName} onChange={handleChange} className="mt-1" />
          ) : (
            <div className="mt-1 p-2.5 block w-full rounded-md border border-slate-200 bg-slate-50 text-slate-900 sm:text-sm">{employee.fullName || '-'}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Email Address</label>
          <div className="mt-1 p-2.5 block w-full rounded-md border border-slate-200 bg-slate-100 text-slate-600 sm:text-sm">{employee.email || '-'}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Phone Number</label>
          {isEditing ? (
            <Input name="phone" value={formData.phone} onChange={handleChange} className="mt-1" />
          ) : (
            <div className="mt-1 p-2.5 block w-full rounded-md border border-slate-200 bg-slate-50 text-slate-900 sm:text-sm">{employee.phone || '-'}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Date of Birth</label>
          {isEditing ? (
            <Input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="mt-1" />
          ) : (
            <div className="mt-1 p-2.5 block w-full rounded-md border border-slate-200 bg-slate-50 text-slate-900 sm:text-sm">{employee.dateOfBirth || '-'}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">CIN / Passport Number</label>
          {isEditing ? (
            <Input name="cinNumber" value={formData.cinNumber} onChange={handleChange} className="mt-1" />
          ) : (
            <div className="mt-1 p-2.5 block w-full rounded-md border border-slate-200 bg-slate-50 text-slate-900 sm:text-sm">{employee.cinNumber || '-'}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Nationality</label>
          {isEditing ? (
            <Input name="nationality" value={formData.nationality} onChange={handleChange} className="mt-1" />
          ) : (
            <div className="mt-1 p-2.5 block w-full rounded-md border border-slate-200 bg-slate-50 text-slate-900 sm:text-sm">{employee.nationality || '-'}</div>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Address</label>
          {isEditing ? (
            <textarea name="address" value={formData.address} onChange={handleChange} className="mt-1 flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2" rows={3} />
          ) : (
            <div className="mt-1 p-2.5 block w-full rounded-md border border-slate-200 bg-slate-50 text-slate-900 sm:text-sm">{employee.address || '-'}</div>
          )}
        </div>
      </div>
    </div>
  );
}
