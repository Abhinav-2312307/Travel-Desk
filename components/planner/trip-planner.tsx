"use client"

import { useState } from "react"
import { Calendar, Clock, Plus, Edit2, Trash2, CalendarDays } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

// Types
type TripDetails = {
  destination: string
  startDate: Date
  endDate: Date
}

type DayPlan = {
  id: string
  date: Date
  activities: Activity[]
}

type Activity = {
  id: string
  time: string
  description: string
  notes: string
  category: ActivityCategory
}

type ActivityCategory = "sightseeing" | "food" | "transportation" | "accommodation" | "other"

// Category colors
const categoryColors: Record<ActivityCategory, string> = {
  sightseeing: "bg-blue-100 text-blue-600 border-blue-200",
  food: "bg-orange-100 text-orange-600 border-orange-200",
  transportation: "bg-green-100 text-green-600 border-green-200",
  accommodation: "bg-purple-100 text-purple-600 border-purple-200",
  other: "bg-gray-100 text-gray-600 border-gray-200",
}

// Sample trip data
const initialTripDetails: TripDetails = {
  destination: "Paris, France",
  startDate: new Date("2025-06-15"),
  endDate: new Date("2025-06-20"),
}

// Generate sample day plans
const generateSampleDayPlans = (startDate: Date, endDate: Date): DayPlan[] => {
  const dayPlans: DayPlan[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    dayPlans.push({
      id: currentDate.toISOString().split("T")[0],
      date: new Date(currentDate),
      activities: [],
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Add some sample activities
  dayPlans[0].activities = [
    {
      id: "1",
      time: "09:00",
      description: "Eiffel Tower Visit",
      notes: "Buy tickets in advance to skip the line",
      category: "sightseeing",
    },
    {
      id: "2",
      time: "13:00",
      description: "Lunch at Le Bistro",
      notes: "Reservation confirmed",
      category: "food",
    },
    {
      id: "3",
      time: "15:00",
      description: "Louvre Museum",
      notes: "Focus on Mona Lisa and Venus de Milo",
      category: "sightseeing",
    },
  ]

  dayPlans[1].activities = [
    {
      id: "4",
      time: "10:00",
      description: "Notre Dame Cathedral",
      notes: "Check if tours are available",
      category: "sightseeing",
    },
    {
      id: "5",
      time: "14:00",
      description: "Seine River Cruise",
      notes: "1-hour cruise, bring camera",
      category: "sightseeing",
    },
  ]

  return dayPlans
}

export default function TripPlanner() {
  const [tripDetails, setTripDetails] = useState<TripDetails>(initialTripDetails)
  const [dayPlans, setDayPlans] = useState<DayPlan[]>(
    generateSampleDayPlans(initialTripDetails.startDate, initialTripDetails.endDate),
  )
  const [selectedDay, setSelectedDay] = useState<string>(format(initialTripDetails.startDate, "yyyy-MM-dd"))
  const [isEditingTrip, setIsEditingTrip] = useState(false)
  const [newActivity, setNewActivity] = useState<Omit<Activity, "id">>({
    time: "",
    description: "",
    notes: "",
    category: "other",
  })
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [isAddingActivity, setIsAddingActivity] = useState(false)

  // Calculate days until trip
  const calculateDaysUntilTrip = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = new Date(tripDetails.startDate)
    start.setHours(0, 0, 0, 0)

    const diffTime = start.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  const daysUntilTrip = calculateDaysUntilTrip()

  // Calculate trip duration
  const calculateTripDuration = () => {
    const start = new Date(tripDetails.startDate)
    const end = new Date(tripDetails.endDate)

    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    return diffDays
  }

  const tripDuration = calculateTripDuration()

  // Update trip details
  const updateTripDetails = () => {
    // Regenerate day plans if dates changed
    if (
      tripDetails.startDate.toDateString() !== initialTripDetails.startDate.toDateString() ||
      tripDetails.endDate.toDateString() !== initialTripDetails.endDate.toDateString()
    ) {
      setDayPlans(generateSampleDayPlans(tripDetails.startDate, tripDetails.endDate))
      setSelectedDay(format(tripDetails.startDate, "yyyy-MM-dd"))
    }

    setIsEditingTrip(false)
  }

  // Add new activity
  const addActivity = () => {
    if (newActivity.description) {
      const activity: Activity = {
        ...newActivity,
        id: Date.now().toString(),
      }

      setDayPlans(
        dayPlans.map((day) => (day.id === selectedDay ? { ...day, activities: [...day.activities, activity] } : day)),
      )

      setNewActivity({
        time: "",
        description: "",
        notes: "",
        category: "other",
      })

      setIsAddingActivity(false)
    }
  }

  // Update activity
  const updateActivity = () => {
    if (editingActivity && editingActivity.description) {
      setDayPlans(
        dayPlans.map((day) =>
          day.id === selectedDay
            ? {
                ...day,
                activities: day.activities.map((activity) =>
                  activity.id === editingActivity.id ? editingActivity : activity,
                ),
              }
            : day,
        ),
      )

      setEditingActivity(null)
    }
  }

  // Delete activity
  const deleteActivity = (activityId: string) => {
    setDayPlans(
      dayPlans.map((day) =>
        day.id === selectedDay
          ? { ...day, activities: day.activities.filter((activity) => activity.id !== activityId) }
          : day,
      ),
    )
  }

  // Get selected day plan
  const selectedDayPlan = dayPlans.find((day) => day.id === selectedDay) || {
    id: selectedDay,
    date: new Date(selectedDay),
    activities: [],
  }

  // Sort activities by time
  const sortedActivities = [...selectedDayPlan.activities].sort((a, b) => {
    if (!a.time) return 1
    if (!b.time) return -1
    return a.time.localeCompare(b.time)
  })

  return (
    <div className="space-y-6">
      {/* Trip Details and Countdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{tripDetails.destination}</CardTitle>
                <CardDescription>
                  {format(tripDetails.startDate, "MMMM d, yyyy")} - {format(tripDetails.endDate, "MMMM d, yyyy")}
                  <span className="ml-2 text-muted-foreground">({tripDuration} days)</span>
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsEditingTrip(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEditingTrip ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={tripDetails.destination}
                    onChange={(e) => setTripDetails({ ...tripDetails, destination: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {format(tripDetails.startDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={tripDetails.startDate}
                          onSelect={(date) => date && setTripDetails({ ...tripDetails, startDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {format(tripDetails.endDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={tripDetails.endDate}
                          onSelect={(date) => date && setTripDetails({ ...tripDetails, endDate: date })}
                          initialFocus
                          disabled={(date) => date < tripDetails.startDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditingTrip(false)}>
                    Cancel
                  </Button>
                  <Button onClick={updateTripDetails}>Save Changes</Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {dayPlans.map((day, index) => (
                  <Button
                    key={day.id}
                    variant={selectedDay === day.id ? "default" : "outline"}
                    className="h-auto py-3 justify-start"
                    onClick={() => setSelectedDay(day.id)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-normal">Day {index + 1}</span>
                      <span className="font-medium">{format(day.date, "EEE, MMM d")}</span>
                      <span className="text-xs mt-1">
                        {day.activities.length} {day.activities.length === 1 ? "activity" : "activities"}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Trip Countdown</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col items-center justify-center h-full py-6">
              {daysUntilTrip > 0 ? (
                <>
                  <div className="text-5xl font-bold">{daysUntilTrip}</div>
                  <div className="text-muted-foreground mt-2">days until your trip</div>
                </>
              ) : daysUntilTrip === 0 ? (
                <>
                  <div className="text-3xl font-bold text-primary">Today's the day!</div>
                  <div className="text-muted-foreground mt-2">Your trip starts today</div>
                </>
              ) : daysUntilTrip > -tripDuration ? (
                <>
                  <div className="text-3xl font-bold text-primary">On your trip!</div>
                  <div className="text-muted-foreground mt-2">
                    Day {Math.abs(daysUntilTrip) + 1} of {tripDuration}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-3xl font-bold">Trip completed</div>
                  <div className="text-muted-foreground mt-2">
                    {Math.abs(daysUntilTrip + tripDuration - 1)} days ago
                  </div>
                </>
              )}

              <div className="mt-6 flex items-center justify-center">
                <CalendarDays className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {format(tripDetails.startDate, "MMMM d")} - {format(tripDetails.endDate, "MMMM d, yyyy")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Planner */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                Day {dayPlans.findIndex((day) => day.id === selectedDay) + 1}:{" "}
                {format(new Date(selectedDay), "EEEE, MMMM d, yyyy")}
              </CardTitle>
              <CardDescription>Plan your activities for this day</CardDescription>
            </div>
            <Button onClick={() => setIsAddingActivity(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sortedActivities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No activities planned for this day. Click "Add Activity" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {sortedActivities.map((activity) => (
                <div key={activity.id} className={`border rounded-lg p-4 ${categoryColors[activity.category]} border`}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {activity.time && (
                          <Badge variant="outline" className="font-mono">
                            <Clock className="mr-1 h-3 w-3" />
                            {activity.time}
                          </Badge>
                        )}
                        <Badge>{activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}</Badge>
                      </div>
                      <h3 className="font-medium text-lg">{activity.description}</h3>
                      {activity.notes && <p className="text-sm">{activity.notes}</p>}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditingActivity(activity)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteActivity(activity.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Activity Dialog */}
          <Dialog open={isAddingActivity} onOpenChange={setIsAddingActivity}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Activity</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={newActivity.time}
                    onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <select
                    id="category"
                    value={newActivity.category}
                    onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value as ActivityCategory })}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="sightseeing">Sightseeing</option>
                    <option value="food">Food</option>
                    <option value="transportation">Transportation</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={newActivity.notes}
                    onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingActivity(false)}>
                  Cancel
                </Button>
                <Button onClick={addActivity}>Add Activity</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Activity Dialog */}
          <Dialog open={!!editingActivity} onOpenChange={(open) => !open && setEditingActivity(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Activity</DialogTitle>
              </DialogHeader>
              {editingActivity && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-time" className="text-right">
                      Time
                    </Label>
                    <Input
                      id="edit-time"
                      type="time"
                      value={editingActivity.time}
                      onChange={(e) => setEditingActivity({ ...editingActivity, time: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="edit-description"
                      value={editingActivity.description}
                      onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-category" className="text-right">
                      Category
                    </Label>
                    <select
                      id="edit-category"
                      value={editingActivity.category}
                      onChange={(e) =>
                        setEditingActivity({ ...editingActivity, category: e.target.value as ActivityCategory })
                      }
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="sightseeing">Sightseeing</option>
                      <option value="food">Food</option>
                      <option value="transportation">Transportation</option>
                      <option value="accommodation">Accommodation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="edit-notes"
                      value={editingActivity.notes}
                      onChange={(e) => setEditingActivity({ ...editingActivity, notes: e.target.value })}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingActivity(null)}>
                  Cancel
                </Button>
                <Button onClick={updateActivity}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
