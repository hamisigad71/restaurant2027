"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilIcon, 
  UserPlusIcon, 
  UserGroupIcon as Users, 
  CheckBadgeIcon as UserCheck, 
  AcademicCapIcon as ChefHat, 
  ShieldCheckIcon as Shield 
} from "@heroicons/react/24/outline"
import { mockStaff } from "@/lib/mock-data"
import type { User, UserRole } from "@/lib/types"

const roleConfig: Record<UserRole, { label: string; color: string; icon: typeof Shield }> = {
  admin: { label: "Admin", color: "bg-primary/10 text-primary border-primary/30", icon: Shield },
  manager: { label: "Manager", color: "bg-chart-2/10 text-chart-2 border-chart-2/30", icon: UserCheck },
  waiter: { label: "Waiter", color: "bg-chart-4/10 text-chart-4 border-chart-4/30", icon: Users },
  kitchen: { label: "Kitchen", color: "bg-chart-1/10 text-chart-1 border-chart-1/30", icon: ChefHat },
  customer: { label: "Customer", color: "bg-purple-500/10 text-purple-400 border-purple-500/30", icon: Users },
  cleaner: { label: "Cleaner", color: "bg-slate-500/10 text-slate-400 border-slate-500/30", icon: Users },
  security: { label: "Security", color: "bg-orange-500/10 text-orange-400 border-orange-500/30", icon: Shield },
}

export default function StaffPage() {

  const [staff, setStaff] = useState<User[]>(mockStaff)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<User | null>(null)

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: staff.length,
    active: staff.filter(s => s.status === "active").length,
    byRole: {
      admin: staff.filter(s => s.role === "admin").length,
      manager: staff.filter(s => s.role === "manager").length,
      waiter: staff.filter(s => s.role === "waiter").length,
      kitchen: staff.filter(s => s.role === "kitchen").length,
    }
  }

  const handleEdit = (member: User) => {
    setEditingStaff(member)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingStaff(null)
    setIsDialogOpen(true)
  }

  const handleToggleStatus = (id: string) => {
    setStaff(prev =>
      prev.map(member =>
        member.id === id
          ? { ...member, status: member.status === "active" ? "inactive" : "active" }
          : member
      )
    )
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 py-4 px-0 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-50" />
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-heading text-foreground">{stats.total}</p>
                  <p className="text-[10px] uppercase  text-muted-foreground font-medium">Total Staff</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <UserCheck className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {Object.entries(stats.byRole).map(([role, count]) => {
            const config = roleConfig[role as UserRole]
            const Icon = config.icon
            return (
              <Card key={role} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.color.split(" ")[0]}`}>
                      <Icon className={`h-5 w-5 ${config.color.split(" ")[1]}`} />
                    </div>
                    <div>
                      <p className="text-2xl">{count}</p>
                      <p className="text-sm text-muted-foreground">{config.label}s</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Staff Table */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="text-base font-medium">Team Members</CardTitle>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search staff..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64 bg-secondary border-0"
                  />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={handleAddNew}>
                      <UserPlusIcon className="h-4 w-4 mr-2" />
                      Add Staff
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingStaff ? "Edit Staff" : "Add Staff"}</DialogTitle>
                      <DialogDescription>
                        {editingStaff ? "Update staff member details" : "Add a new team member"}
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4">
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="name">Full Name</FieldLabel>
                          <Input
                            id="name"
                            defaultValue={editingStaff?.name}
                            placeholder="John Kamau"
                            className="bg-secondary border-border"
                          />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="email">Email</FieldLabel>
                          <Input
                            id="email"
                            type="email"
                            defaultValue={editingStaff?.email}
                            placeholder="john@restaurant.com"
                            className="bg-secondary border-border"
                          />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="role">Role</FieldLabel>
                          <Select defaultValue={editingStaff?.role || "waiter"}>
                            <SelectTrigger className="bg-secondary border-border">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin (Owner)</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="waiter">Waiter</SelectItem>
                              <SelectItem value="kitchen">Kitchen Staff</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      </FieldGroup>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                          {editingStaff ? "Update" : "Add"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Staff Member</TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground">Role</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Joined</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((member) => {
                  const config = roleConfig[member.role]
                  return (
                    <TableRow key={member.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{member.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={config.color}>
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            member.status === "active"
                              ? "bg-success/10 text-success border-success/30"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {member.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{member.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={() => handleToggleStatus(member.id)}
                          >
                            {member.status === "active" ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(member)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
