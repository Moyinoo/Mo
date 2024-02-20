import IAssessmentData, {
  IQuestion,
} from '../features/Assesement/interfaces/assesement.interface'
import { v4 } from 'uuid'
import { IJobSchDb } from '../features/jobs/interfaces/jobs.interface'
import { IEduDb } from '../features/education/interfaces/education.interface'
import { IExpDb } from '../features/experience/interfaces/experience.interface'
import { ICertDb } from '../features/certification/interfaces/certification.interface'
import { IXpertDb } from '../features/expertise/interfaces/expertise.interface'
import { ISkilzDb } from '../features/skilz/interfaces/skilz.interface'
import { ITestimonialDb } from '../features/testimonial/interfaces/testimonial.interface'
import { ISchDb } from '../features/school/interfaces/school.interface'
import { IUserDb } from '../features/users/interfaces/user.interface'
import { SelectedModel } from '../features/selected/models/selected.model'
import { EducationModel } from '../features/education/models/education.model'
import { ExperienceModel } from '../features/experience/models/experience.model'
import { CertificationModel } from '../features/certification/models/certification.model'
import { ExpertiseModel } from '../features/expertise/models/expertise.model'
import { SkilzModel } from '../features/skilz/models/skilz.model'
import { TestimonialModel } from '../features/testimonial/models/testimonial.model'
import { JobModel } from '../features/jobs/models/job.model'
import sendValidationMail from '../mail/sendValidationMail'

export interface IJobUserMatch {
  job: (IJobSchDb & ISchDb)[]
  profile: {
    user: IUserDb
    education: IEduDb[]
    experience: IExpDb[]
    skilz: ISkilzDb[]
    expertise: IXpertDb[]
  }
}

export type IAppliedObject = {
  ap_sample_answer: string
  education: IEduDb[] | []
  experience: IExpDb[] | []
  certification: ICertDb[] | []
  expertise: IXpertDb[] | []
  skilz: ISkilzDb[]
  testimonial: ITestimonialDb[] | []
  user: any
  applied_count: number
  ap_job_id: number
}

const hash: { [key: string]: number } = {
  SSCE: 2,
  OND: 4,
  NCE: 6,
  HND: 8,
  BACHELORS: 10,
  MASTERS: 12,
  DOCTORATE: 14,
}

export function handleFormat(dataList: IAssessmentData) {
  for (const entry of dataList) {
    const learningPath = Object.keys(entry).find(key => key !== 'total')

    if (learningPath) {
      const questions = entry[learningPath] as unknown as IQuestion[]
      const firstName = questions[0].answer
      const email = questions[questions.length - 1].answer
      console.log(email)

      return {
        firstName,
        email,
      }
    }

    break
  }
}

export function handlePath(path: any, taken: number, data: string[]) {
  const result = JSON.parse(path)
  result.push({ [taken]: JSON.stringify(data) })
  return JSON.stringify(result)
}
export function handleResult(path: any, taken: number, data: any) {
  const result = JSON.parse(path)
  result.push({ [taken]: JSON.stringify(data) })
  return JSON.stringify(result)
}

export function generateNumberCode() {
  const uuid = v4()
  // Extract the first 4 digits from the UUID (excluding hyphens)
  const random4DigitNumber = parseInt(
    uuid.replace(/-/g, '').substring(0, 4),
    16,
  )
  return random4DigitNumber.toString().padStart(4, '0') // Ensure it's a 4-digit number with leading zeros if necessary
}

export const getMatchedCountAndusers = (jobs: IJobSchDb[], applied: any) => {
  const nJob = [...jobs].map((job: IJobSchDb) => {
    const allApplicants = applied[job.job_id]
    let match_count = 0
    let matched_ids: number[] = []

    const newApplicant = allApplicants?.filter((applicant: IAppliedObject) => {
      let score = 0 // Initialize score for each applicant

      console.log(applicant.user?.email)
      if (applicant.user?.city === job.job_city) {
        console.log('city')
        score += 20
      }
      if (applicant.user?.state === job.job_state) {
        console.log('state')
        score += 10
      }
      if (applicant.user?.lga === job.job_lga) {
        console.log('state')
        score += 20
      }

      console.log(applicant.education[0]?.edu_degree)
      //@ts-ignore
      if (
        hash[applicant.education[0]?.edu_degree.toLowerCase()] >=
        hash[job.job_qual.toLowerCase()]
      ) {
        console.log('degree')
        score += 30
      }

      applicant.experience.forEach(e => {
        //@ts-ignore
        if (e.exp_title.toLowerCase() === job.job_title.toLowerCase()) {
          console.log('experience')
          score += 10
        }
      })

      applicant.expertise.forEach(xp => {
        if (JSON.parse(job.job_xpertise).includes(xp.xpert_subject)) {
          score += 10
        }
      })

      applicant.expertise.forEach(xp => {
        if (xp.xpert_subject === job.job_title.split(' ')[0].toLowerCase()) {
          score += 10
        }
      })

      //@ts-ignore
      applicant.skilz[0]?.skill &&
        //@ts-ignore
        JSON.parse(applicant.skilz[0]?.skills).forEach(sk => {
          if (JSON.parse(job.job_skills).includes(sk)) {
            score += 10
          }
        })

      console.log(score)

      return score >= 60
    })

    if (newApplicant?.length > 0) {
      match_count += newApplicant?.length
    }

    return {
      ...job,
      matched: newApplicant ? newApplicant : [],
      matchedIds: newApplicant
        ? newApplicant.map((n: IAppliedObject) => n.user.id)
        : [],
      match_count,
    }
  })

  return nJob
}

export const getMatchedJobsusers = (jobs: IJobUserMatch) => {
  const { job, profile } = jobs

  const newJob = job.filter(j => {
    let score = 0
    if (j.job_city === profile.user.city) {
      score += 10
    }
    if (j.job_state === profile.user.state) {
      score += 10
    }
    if (j.job_lga === profile.user.lga) {
      score += 10
    }
    if (hash[profile.education[0]?.edu_degree] >= hash[j.job_qual]) {
      score += 10
    }
    profile.experience.forEach(exp => {
      if (exp.exp_title.toLowerCase() === j.job_title.toLowerCase()) {
        score += 10
      }
    })
    profile.expertise.forEach(xp => {
      if (xp.xpert_subject === j.job_title.split(' ')[0].toLowerCase()) {
        score += 10
      }
    })
    profile.expertise.forEach(xp => {
      if (JSON.parse(j.job_xpertise).includes(xp.xpert_subject)) {
        score += 10
      }
    })

    if (profile.user.open_to_work) {
      score += 10
    }
    //@ts-ignore
    profile?.skilz[0]?.skills &&
      //@ts-ignore
      JSON.parse(profile?.skilz[0]?.skills).forEach(sk => {
        if (JSON.parse(j.job_skills).includes(sk)) {
          score += 10
        }
      })
    delete j.wallet
    delete j.sch_url
    delete j.sch_admins_str

    return score >= 40
  })

  // console.log(newJob)

  return newJob
}

export const isDateEqual = (time: string, time2: string) => {
  const a = new Date(time)
  const b = new Date(time2)
  b.setUTCHours(24)
  const c = a.getTime()
  const d = b.getTime()
  return c === d
}

export const compareTimes = (timeString1: string, timeString2: string) => {
  const a = new Date(timeString1)
  const b = new Date(timeString2 + 'Z')
  const hr1 = a.getHours()
  const hr2 = b.getHours()
  const isHour = hr1 === hr2
  const isMin = a.getMinutes() === b.getMinutes()
  return isHour && isMin
}

export const mergeDateAndTime = (dateString1: string, dateString2: string) => {
  // Parse the date and time from the first string
  console.log(dateString1)
  const date1 = new Date(dateString1)
  console.log(date1)
  const hours1 = date1.getUTCHours()
  console.log(hours1)

  const minutes1 = date1.getUTCMinutes()
  console.log(minutes1)

  // Add 1 hour to the time
  const newHours1 = hours1

  // Format the new time
  const timeString = `${hours1.toString().padStart(2, '0')}:${minutes1
    .toString()
    .padStart(2, '0')}:00.000Z`
  console.log(timeString)

  // Extract the date from the second string
  const n = new Date(dateString2)
  const date2 = n.toISOString().slice(0, 10)
  // Merge the date and the new time
  const mergedDateTime = `${date2}T${timeString}`

  return mergedDateTime
}

export async function getSelectedCount(data: IJobSchDb[]) {
  const result = await Promise.all(
    data.map(async d => {
      const selected = await SelectedModel.findBySchAndJob(
        d.job_sch_user,
        d.job_id,
      )
      return {
        ...d,
        selected_count: selected.length,
      }
    }),
  )

  return result
}

export async function getProfileMatch(params: IUserDb[], profile: number) {
  const data = await Promise.all(
    params.map(async (p: IUserDb) => {
      let total = 0
      const educationPromise = EducationModel.findbyId(p.id!)
      const experiencePromise = ExperienceModel.findbyId(p.id!)
      const certificationPromise = CertificationModel.findbyId(p.id!)
      const expertisePromise = ExpertiseModel.findbyId(p.id!)
      const skilzPromise = SkilzModel.findbyId(p.id!)
      const testimonialPromise = TestimonialModel.findbyId(p.id!)

      const [
        education,
        experience,
        certification,
        expertise,
        skilz,
        testimonial,
      ] = await Promise.all([
        educationPromise,
        experiencePromise,
        certificationPromise,
        expertisePromise,
        skilzPromise,
        testimonialPromise,
      ])

      if (p.fname.length > 0) {
        total += 10
      }
      if (p.cv && p.cv.length > 0) {
        total += 10
      }
      if (p.phone && p.phone?.length > 0) {
        total += 10
      }
      if (p.description && p.description?.length > 50) {
        total += 10
      }
      if ((education as unknown as IEduDb[]).length > 0) {
        total += 10
      }
      if ((experience as unknown as IExpDb[]).length > 0) {
        total += 10
      }
      if ((skilz as unknown as ISkilzDb[]).length > 0) {
        total += 10
      }
      if ((certification as unknown as ICertDb[]).length > 0) {
        total += 10
      }
      if ((testimonial as unknown as ITestimonialDb[]).length > 0) {
        total += 10
      }

      return { ...p, total }
    }),
  )

  const filteredData = data.filter(result => result.total >= profile)

  return filteredData
}

export async function getPostedMatch(params: ISchDb[]) {
  const data = await Promise.all(
    params.map(async (p: ISchDb) => {
      const postedJobPromise = JobModel.findbyId(p.sch_id!)

      const [job] = await Promise.all([postedJobPromise])

      return { ...p, hasJob: (job as unknown as IJobSchDb[]).length > 0, job }
    }),
  )

  const filteredData = data.filter(result => result.hasJob)

  return filteredData
}

export async function sendValMail(email: string, fname: string, token: string) {
  sendValidationMail({
    email,
    firstName: fname,
    link: `tayture.com/verify/${token}`,
  })
}

export const scheduleMessage = `you have been scheduled for an interview`
