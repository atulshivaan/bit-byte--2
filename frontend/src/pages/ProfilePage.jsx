import { useAuthStore } from "../store/useAuthStore.js"


const ProfilePage = () => {
  const{authUser}=useAuthStore();
  return (
    <div>
      <h1>Profile Page</h1>
    </div>
  )
}

export default ProfilePage
