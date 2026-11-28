"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  MagnifyingGlassIcon,
  PencilIcon,
  UserPlusIcon,
  UserGroupIcon as Users,
  CheckBadgeIcon as UserCheck,
  AcademicCapIcon as ChefHat,
  ShieldCheckIcon as Shield,
} from "@heroicons/react/24/outline"
import { mockStaff } from "@/lib/mock-data"
import type { User, UserRole } from "@/lib/types"

const roleConfig: Record<UserRole, { label: string; color: string; icon: typeof Shield }> = {
  admin: { label: "Admin", color: "bg-primary/10 text-primary border-primary/30", icon: Shield },
  manager: { label: "Manager", color: "bg-chart-2/10 text-chart-2 border-chart-2/30", icon: UserCheck },
  waiter: { label: "Waiter", color: "bg-chart-4/10 text-chart-4 border-chart-4/30", icon: Users },
  kitchen: { label: "Kitchen", color: "bg-chart-1/10 text-chart-1 border-chart-1/30", icon: ChefHat },
  customer: { label: "Customer", color: "bg-secondary text-secondary-foreground border-border", icon: Users },
  cleaner: { label: "Cleaner", color: "bg-muted text-muted-foreground border-border", icon: Users },
  security: { label: "Security", color: "bg-warning/10 text-warning border-warning/30", icon: Shield },
}

export default function StaffPage() {
  const [staff, setStaff] = useState<User[]>(mockStaff)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<User | null>(null)

  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const stats = {
    total: staff.length,
    active: staff.filter((s) => s.status === "active").length,
    byRole: {
      admin: staff.filter((s) => s.role === "admin").length,
      manager: staff.filter((s) => s.role === "manager").length,
      waiter: staff.filter((s) => s.role === "waiter").length,
      kitchen: staff.filter((s) => s.role === "kitchen").length,
    },
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
    setStaff((prev) =>
      prev.map((member) =>
        member.id === id
          ? { ...member, status: member.status === "active" ? "inactive" : "active" }
          : member,
      ),
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 py-4 px-0 space-y-6">
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-6">
          <Card size="sm">
            <CardHeader>
              <CardDescription className="text-xs font-medium">Total Staff</CardDescription>
              <CardAction>
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="size-4" />
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl font-semibold tabular-nums">{stats.total}</CardTitle>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardDescription className="text-xs font-medium">Active</CardDescription>
              <CardAction>
                <div className="flex size-8 items-center justify-center rounded-lg bg-success/10 text-success">
                  <UserCheck className="size-4" />
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl font-semibold tabular-nums">{stats.active}</CardTitle>
            </CardContent>
          </Card>

          {Object.entries(stats.byRole).map(([role, count]) => {
            const config = roleConfig[role as UserRole]
            const Icon = config.icon
            return (
              <Card key={role} size="sm">
                <CardHeader>
                  <CardDescription className="text-xs font-medium">{config.label}s</CardDescription>
                  <CardAction>
                    <div className={`flex size-8 items-center justify-center rounded-lg ${config.color}`}>
                      <Icon className="size-4" />
                    </div>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-2xl font-semibold tabular-nums">{count}</CardTitle>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">Team Members</CardTitle>
            <CardDescription>Manage roles, permissions, and account status</CardDescription>
            <CardAction className="flex items-center gap-2">
              <InputGroup className="w-full sm:w-64">
                <InputGroupAddon>
                  <MagnifyingGlassIcon />
                </InputGroupAddon>
                <InputGroupInput
                  type="search"
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={handleAddNew}>
                    <UserPlusIcon className="size-4" />
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
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={editingStaff?.email}
                          placeholder="john@restaurant.com"
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="role">Role</FieldLabel>
                        <Select defaultValue={editingStaff?.role || "waiter"}>
                          <SelectTrigger>
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
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                        {editingStaff ? "Update" : "Add"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardAction>
          </CardHeader>
          <CardContent>
            {filteredStaff.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Users />
                  </EmptyMedia>
                  <EmptyTitle>No team members found</EmptyTitle>
                  <EmptyDescription>Try searching with another name or email.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((member) => {
                    const config = roleConfig[member.role]
                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
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
                              onClick={() => handleToggleStatus(member.id)}
                            >
                              {member.status === "active" ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleEdit(member)}
                            >
                              <PencilIcon className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
