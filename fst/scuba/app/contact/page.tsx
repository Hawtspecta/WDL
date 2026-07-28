export default function Contact() {
    return (
        <section className="text-gray-600 body-font relative">
            <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
                {/* Map Section */}
                <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
                    <iframe
                        width="100%"
                        height="100%"
                        className="absolute inset-0"
                        title="map"
                        src="https://maps.google.com/maps?width=100%&height=600&hl=en&q=Izmir+(My%20Business%20Name)&ie=UTF8&t=&z=14&iwloc=B&output=embed"
                        style={{ filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}
                    ></iframe>
                    <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
                        <div className="lg:w-1/2 px-6">
                            <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                                ADDRESS
                            </h2>
                            <p className="mt-1">
                                Photo booth tattooed prism, Portland taiyaki hoodie neutra typewriter
                            </p>
                        </div>
                        <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                            <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                                EMAIL
                            </h2>
                            <a href="mailto:example@email.com" className="text-indigo-500 leading-relaxed">
                                example@email.com
                            </a>
                            <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">
                                PHONE
                            </h2>
                            <p className="leading-relaxed">123-456-7890</p>
                        </div>
                    </div>
                </div>

                {/* Feedback Form */}
                {/* Feedback Form */}
                <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-12 mt-8 md:mt-0 shadow-lg rounded-lg p-8">
                    <h2 className="text-gray-900 text-2xl mb-4 font-semibold title-font">Feedback</h2>
                    <p className="leading-relaxed mb-6 text-gray-600">
                        We’d love to hear your thoughts!
                    </p>
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
        focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-4"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
        focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-4"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
        focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-4 resize-none"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full text-white bg-indigo-600 hover:bg-indigo-700 
      focus:ring-4 focus:ring-indigo-300 font-medium rounded-md text-lg py-3 transition"
                        >
                            Submit
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-6 text-center">
                        Your feedback helps us improve!
                    </p>
                </div>
            </div>
        </section>
    );
}
